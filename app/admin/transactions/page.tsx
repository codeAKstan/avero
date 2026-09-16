"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  X,
  Loader2,
  RefreshCw,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  TrendingUp,
  Receipt,
  User,
  Calendar,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);

  // Revenue & transaction stats
  const [stats, setStats] = useState<{
    totalRevenue: number;
    totalTransactions: number;
    successfulCount: number;
    pendingCount: number;
    failedCount: number;
  }>({
    totalRevenue: 0,
    totalTransactions: 0,
    successfulCount: 0,
    pendingCount: 0,
    failedCount: 0,
  });

  // Modal inspection state
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        plan: planFilter,
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`/api/admin/payments?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments || []);
        if (data.stats) {
          setStats(data.stats);
        }
        setTotalPages(data.pagination?.pages || 1);
        setTotalPayments(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch transaction logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [search, statusFilter, planFilter, page, limit]);

  const openInspectionModal = (payment: any) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  const exportToCSV = () => {
    if (payments.length === 0) return;
    const headers = [
      "Payment Reference",
      "Customer Name",
      "Customer Email",
      "Plan",
      "Amount (NGN)",
      "Status",
      "Paystack Channel",
      "Paystack Customer Code",
      "Transaction Date",
    ];

    const rows = payments.map((p) => [
      `"${p.reference}"`,
      `"${p.userId?.fullName || "Unknown"}"`,
      `"${p.userId?.email || "N/A"}"`,
      `"${p.plan === "pro_annual" ? "Pro Annual" : "Pro Monthly"}"`,
      `"${p.amountNaira}"`,
      `"${p.status}"`,
      `"${p.paystackChannel || "N/A"}"`,
      `"${p.paystackCustomerCode || "N/A"}"`,
      `"${new Date(p.createdAt).toISOString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `avero_transactions_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payment Transactions</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-extrabold flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
              Paystack Ledger
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Monitor incoming subscription revenues, search Paystack reference IDs, and inspect payment attempts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Transactions CSV</span>
          </button>
          <button
            onClick={fetchPayments}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
            title="Refresh Transactions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Financial Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{formatNaira(stats.totalRevenue)}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Cumulative successful subscription earnings
          </p>
        </div>

        {/* Successful Payments */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Successful Payments</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.successfulCount}</div>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Settled transactions
          </p>
        </div>

        {/* Pending Payments */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Attempts</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-700">{stats.pendingCount}</div>
          <p className="text-[11px] text-amber-600 mt-1 font-medium">
            Awaiting checkout completion
          </p>
        </div>

        {/* Failed Transactions */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Failed Transactions</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-700">{stats.failedCount}</div>
          <p className="text-[11px] text-rose-600 mt-1 font-medium">
            Unsuccessful payment attempts
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Paystack reference, customer name, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2866e1]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2866e1]"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success Only</option>
              <option value="pending">Pending Only</option>
              <option value="failed">Failed Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Plan:</span>
            <select
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2866e1]"
            >
              <option value="all">All Plans</option>
              <option value="pro_monthly">Pro Monthly</option>
              <option value="pro_annual">Pro Annual</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        {loading ? (
          <div className="py-16 flex items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#2866e1]" />
            <span className="text-sm">Fetching payment transaction logs...</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm space-y-2">
            <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No payment transactions found matching your query filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Transaction Date</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Paystack Reference</th>
                    <th className="py-3.5 px-4">Plan Tier</th>
                    <th className="py-3.5 px-4">Amount (NGN)</th>
                    <th className="py-3.5 px-4">Channel</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {payments.map((p) => {
                    const dateFormatted = new Date(p.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr key={p._id} className="hover:bg-slate-50/70 transition">
                        <td className="py-4 px-4 font-medium text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{dateFormatted}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-900">
                          <div>{p.userId?.fullName || "Deleted User"}</div>
                          <div className="text-[11px] font-normal text-slate-500">{p.userId?.email || "—"}</div>
                        </td>
                        <td className="py-4 px-4 font-mono text-slate-800 text-[11px]">
                          <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                            {p.reference}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="capitalize px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2866e1] border border-blue-200">
                            {p.plan === "pro_annual" ? "Pro Annual Pass" : "Pro Monthly Pass"}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-extrabold text-slate-900 text-sm">
                          {formatNaira(p.amountNaira)}
                        </td>
                        <td className="py-4 px-4 capitalize text-slate-500 font-medium">
                          {p.paystackChannel || "card"}
                        </td>
                        <td className="py-4 px-4">
                          {p.status === "success" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Success
                            </span>
                          ) : p.status === "pending" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                              <Clock className="w-3 h-3 text-amber-600" /> Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                              <XCircle className="w-3 h-3 text-rose-600" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => openInspectionModal(p)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1"
                            title="Inspect Transaction Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="bg-slate-50/70 border-t border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 text-slate-600">
                <span>
                  Showing <strong>{totalPayments === 0 ? 0 : (page - 1) * limit + 1}</strong> to{" "}
                  <strong>{Math.min(page * limit, totalPayments)}</strong> of <strong>{totalPayments}</strong> transactions
                </span>

                <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
                  <span className="text-slate-500 font-semibold">Per page:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(parseInt(e.target.value, 10));
                      setPage(1);
                    }}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 text-xs font-semibold focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage(1)}
                  disabled={page <= 1}
                  className="p-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-100 transition cursor-pointer disabled:cursor-not-allowed"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                  className="p-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-100 transition cursor-pointer disabled:cursor-not-allowed"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-3 py-1 bg-white border border-slate-200 text-slate-800 font-bold rounded-lg text-xs">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-100 transition cursor-pointer disabled:cursor-not-allowed"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage(totalPages)}
                  disabled={page >= totalPages}
                  className="p-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-100 transition cursor-pointer disabled:cursor-not-allowed"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Transaction Details Inspector Modal */}
      {isDetailModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-[#2866e1] flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Transaction Record Inspector</h3>
                  <p className="text-xs text-slate-500">Paystack Reference: {selectedPayment.reference}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Status Header */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-slate-500 font-medium">Transaction Amount</div>
                  <div className="text-2xl font-extrabold text-slate-900">{formatNaira(selectedPayment.amountNaira)}</div>
                </div>
                <div>
                  {selectedPayment.status === "success" ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settled
                    </span>
                  ) : selectedPayment.status === "pending" ? (
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" /> Pending
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" /> Failed
                    </span>
                  )}
                </div>
              </div>

              {/* Details Breakdown */}
              <div className="space-y-3 divide-y divide-slate-100">
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-medium">Plan Tier:</span>
                  <span className="font-bold text-slate-900 capitalize">
                    {selectedPayment.plan === "pro_annual" ? "Avero Pro Annual" : "Avero Pro Monthly"}
                  </span>
                </div>

                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-medium">Customer Name:</span>
                  <span className="font-bold text-slate-900">{selectedPayment.userId?.fullName || "N/A"}</span>
                </div>

                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-medium">Customer Email:</span>
                  <span className="font-bold text-slate-900">{selectedPayment.userId?.email || "N/A"}</span>
                </div>

                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-medium">Paystack Channel:</span>
                  <span className="font-bold text-slate-900 capitalize">{selectedPayment.paystackChannel || "Card"}</span>
                </div>

                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-medium">Paystack Customer Code:</span>
                  <span className="font-mono text-slate-700">{selectedPayment.paystackCustomerCode || "N/A"}</span>
                </div>

                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500 font-medium">Payment Timestamp:</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(selectedPayment.createdAt).toLocaleString("en-NG")}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-5 py-2.5 bg-[#2866e1] hover:bg-[#1d52bf] text-white rounded-xl font-bold transition shadow-sm"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
