import { IUser } from "@/models/User";
import { ICourse } from "@/models/Course";

export function isProUser(user: IUser | null | undefined): boolean {
  if (!user) return false;
  if (user.role === "admin" || user.role === "educator") return true;

  if (user.subscriptionPlan === "pro") {
    // If expiration date exists, check it; otherwise treat active pro as valid
    if (user.subscriptionExpiresAt) {
      return new Date(user.subscriptionExpiresAt).getTime() > Date.now();
    }
    return true;
  }

  return false;
}

export function filterCourseQuestionsForUser(course: ICourse, user: IUser | null | undefined) {
  const userIsPro = isProUser(user);
  
  // If user is Pro, return all questions
  if (userIsPro) {
    return {
      allowed: true,
      questions: course.questions || [],
      totalQuestions: course.questions?.length || 0,
      isRestricted: false,
      freeLimit: course.questions?.length || 0,
    };
  }

  // If course explicitly disables free access
  if (course.isFreeAccess === false) {
    return {
      allowed: false,
      questions: [],
      totalQuestions: course.questions?.length || 0,
      isRestricted: true,
      freeLimit: 0,
      reason: "This course is exclusive to Pro members.",
    };
  }

  // Sliced questions for free user based on freeQuestionLimit
  const limit = typeof course.freeQuestionLimit === "number" ? course.freeQuestionLimit : 5;
  const slicedQuestions = (course.questions || []).slice(0, limit);

  return {
    allowed: true,
    questions: slicedQuestions,
    totalQuestions: course.questions?.length || 0,
    isRestricted: (course.questions?.length || 0) > limit,
    freeLimit: limit,
  };
}
