/**
 * Utility functions for exporting course catalog data, question banks, and exact rationales to CSV and JSON formats.
 */

const escapeCSV = (val: any): string => {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};

/**
 * Trigger a browser file download from Blob.
 */
const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export array of course summary metadata to CSV.
 */
export const exportCoursesSummaryCSV = (courses: any[], filenamePrefix = "avero_courses_summary") => {
  if (!courses || courses.length === 0) {
    alert("No course data available to export.");
    return;
  }

  const headers = [
    "Course Title",
    "Category",
    "Subcategory",
    "Level",
    "Status",
    "Questions Count",
    "Modules Count",
    "Time Limit (Mins)",
    "Passing Score (%)",
    "Allowed Modes",
    "Created At"
  ];

  const rows = courses.map((c) => [
    escapeCSV(c.title || ""),
    escapeCSV(c.categoryId?.name || c.category || "Uncategorized"),
    escapeCSV(c.subcategoryName || ""),
    escapeCSV(c.level || "Intermediate"),
    escapeCSV(c.status || "Draft"),
    escapeCSV(Array.isArray(c.questions) ? c.questions.length : 0),
    escapeCSV(Array.isArray(c.modules) ? c.modules.length : 0),
    escapeCSV(c.timeLimitMinutes ?? 60),
    escapeCSV(c.passingScorePercentage ?? 75),
    escapeCSV(Array.isArray(c.allowedModes) ? c.allowedModes.join(", ") : "Practice, Exam"),
    escapeCSV(c.createdAt ? new Date(c.createdAt).toISOString() : ""),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const filename = `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.csv`;
  triggerDownload(blob, filename);
};

/**
 * Export question bank (questions, options A-D, correct answer, exact rationale) to CSV.
 */
export const exportQuestionBankCSV = (courses: any[], customFilename?: string) => {
  if (!courses || courses.length === 0) {
    alert("No course data available to export.");
    return;
  }

  const headers = [
    "Course Title",
    "Category",
    "Question Number",
    "Question Text",
    "Option A",
    "Option B",
    "Option C",
    "Option D",
    "Correct Answer",
    "Exact Rationale / Explanation"
  ];

  const rows: string[][] = [];

  courses.forEach((c) => {
    const qList = Array.isArray(c.questions) ? c.questions : [];
    qList.forEach((q: any, idx: number) => {
      const opts = Array.isArray(q.options) ? q.options : [];
      rows.push([
        escapeCSV(c.title || ""),
        escapeCSV(c.categoryId?.name || c.category || "Uncategorized"),
        escapeCSV(idx + 1),
        escapeCSV(q.question || ""),
        escapeCSV(opts[0] || ""),
        escapeCSV(opts[1] || ""),
        escapeCSV(opts[2] || ""),
        escapeCSV(opts[3] || ""),
        escapeCSV(q.correctAnswer || ""),
        escapeCSV(q.explanation || "")
      ]);
    });
  });

  if (rows.length === 0) {
    alert("No questions found in selected course(s) to export.");
    return;
  }

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  let filename = customFilename;
  if (!filename) {
    if (courses.length === 1) {
      const sanitizedTitle = (courses[0].title || "course").toLowerCase().replace(/[^\w]/g, "_");
      filename = `avero_testbank_${sanitizedTitle}_${new Date().toISOString().slice(0, 10)}.csv`;
    } else {
      filename = `avero_question_banks_export_${new Date().toISOString().slice(0, 10)}.csv`;
    }
  }

  triggerDownload(blob, filename);
};

/**
 * Export full courses JSON data including metadata, modules, and complete question bank with verbatim rationales.
 */
export const exportCoursesJSON = (courses: any[], customFilename?: string) => {
  if (!courses || courses.length === 0) {
    alert("No course data available to export.");
    return;
  }

  const exportData = courses.map((c) => ({
    id: c._id || c.id,
    title: c.title,
    slug: c.slug,
    category: c.categoryId?.name || c.category || "Uncategorized",
    subcategoryName: c.subcategoryName || "",
    description: c.description,
    thumbnail: c.thumbnail,
    level: c.level,
    status: c.status,
    timeLimitMinutes: c.timeLimitMinutes,
    passingScorePercentage: c.passingScorePercentage,
    allowedModes: c.allowedModes,
    modules: c.modules || [],
    questions: (c.questions || []).map((q: any) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    })),
    createdAt: c.createdAt,
  }));

  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });

  let filename = customFilename;
  if (!filename) {
    if (courses.length === 1) {
      const sanitizedTitle = (courses[0].title || "course").toLowerCase().replace(/[^\w]/g, "_");
      filename = `avero_course_${sanitizedTitle}_${new Date().toISOString().slice(0, 10)}.json`;
    } else {
      filename = `avero_courses_export_${new Date().toISOString().slice(0, 10)}.json`;
    }
  }

  triggerDownload(blob, filename);
};

/**
 * Export question bank and course metadata to Microsoft Word (.docx) format.
 */
export const exportQuestionBankDOCX = async (courses: any[], customFilename?: string) => {
  if (!courses || courses.length === 0) {
    alert("No course data available to export.");
    return;
  }

  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");

  const docChildren: any[] = [];

  courses.forEach((c, courseIdx) => {
    const courseTitle = c.title || `Course ${courseIdx + 1}`;
    const category = c.categoryId?.name || c.category || "Uncategorized";
    const level = c.level || "Intermediate";
    const description = c.description || "";
    const qList = Array.isArray(c.questions) ? c.questions : [];
    const modules = Array.isArray(c.modules) ? c.modules : [];

    // Document / Course Header
    docChildren.push(
      new Paragraph({
        text: courseTitle,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 120 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Category: ", bold: true }),
          new TextRun({ text: `${category} | ` }),
          new TextRun({ text: "Difficulty Level: ", bold: true }),
          new TextRun({ text: `${level}` }),
        ],
        spacing: { after: 100 },
      })
    );

    if (description) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Description: ", bold: true }),
            new TextRun({ text: description }),
          ],
          spacing: { after: 200 },
        })
      );
    }

    // Modules summary section if present
    if (modules.length > 0) {
      docChildren.push(
        new Paragraph({
          text: "Course Modules & Key Summaries",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );

      modules.forEach((mod: any, mIdx: number) => {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${mIdx + 1}. ${mod.title || "Module"}`, bold: true }),
            ],
            spacing: { before: 60, after: 40 },
          })
        );
        if (mod.content) {
          docChildren.push(
            new Paragraph({
              children: [new TextRun({ text: mod.content })],
              spacing: { after: 100 },
            })
          );
        }
      });
    }

    // Past Questions Header
    docChildren.push(
      new Paragraph({
        text: `Exam Question Bank (${qList.length} Questions)`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
      })
    );

    qList.forEach((q: any, qIdx: number) => {
      const opts = Array.isArray(q.options) ? q.options : [];
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Q${qIdx + 1}: `, bold: true, color: "1D52BF" }),
            new TextRun({ text: q.question || "Question prompt missing", bold: true }),
          ],
          spacing: { before: 160, after: 80 },
        })
      );

      // Options A-D
      opts.forEach((opt: string) => {
        docChildren.push(
          new Paragraph({
            children: [new TextRun({ text: `   • ${opt}` })],
            spacing: { after: 40 },
          })
        );
      });

      // Correct Answer
      if (q.correctAnswer) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: "   Correct Answer: ", bold: true, color: "166534" }),
              new TextRun({ text: q.correctAnswer, bold: true, color: "166534" }),
            ],
            spacing: { before: 60, after: 40 },
          })
        );
      }

      // Verbatim Rationale / Explanation
      if (q.explanation) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({ text: "   Verbatim Rationale: ", bold: true, color: "475569" }),
              new TextRun({ text: q.explanation, italics: true }),
            ],
            spacing: { after: 140 },
          })
        );
      }
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  let filename = customFilename;
  if (!filename) {
    if (courses.length === 1) {
      const sanitizedTitle = (courses[0].title || "course").toLowerCase().replace(/[^\w]/g, "_");
      filename = `avero_questionbank_${sanitizedTitle}_${new Date().toISOString().slice(0, 10)}.docx`;
    } else {
      filename = `avero_questionbanks_export_${new Date().toISOString().slice(0, 10)}.docx`;
    }
  }

  triggerDownload(blob, filename);
};

