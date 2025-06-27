"use client";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { fetchWithSessionRefresh } from "@/app/utils/fetchWithSessionRefresh";

const AdminComp = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  useEffect(() => {
    const fetchUserAndLogs = async () => {
      try {
        const meRes = await fetchWithSessionRefresh(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/me`,
          { method: "GET", credentials: "include" }
        );

        if (!meRes.ok) {
          if (meRes.status === 401) {
            toast.error("Kredensial tidak valid");
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          } else {
            toast.error("Kredensial tidak valid");
            setTimeout(() => {
              window.location.href = "/home";
            }, 1500);
          }
          return;
        }

        const logRes = await fetchWithSessionRefresh(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/logs`,
          { method: "GET", credentials: "include" }
        );

        if (!logRes.ok) {
          throw new Error(`HTTP error! status: ${logRes.status}`);
        }

        const json = await logRes.json();
        if (!json.success || !Array.isArray(json.data)) {
          throw new Error("Format response tidak sesuai");
        }

        setLogs(json.data);
      } catch (err) {
        console.error("Error:", err);

        if (err.message.includes("401") || err.message.includes("403")) {
          toast.error("Session expired, silakan login kembali");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        } else {
          toast.error("Gagal mengambil data log");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndLogs();
  }, []);

  if (unauthorized) {
    return (
      <section className="p-6 text-center">
        <Toaster />
        <h1 className="text-3xl font-bold text-red-700">403 Forbidden</h1>
        <p className="mt-2 text-gray-600">
          Kamu tidak memiliki akses ke halaman ini
        </p>
        <p className="mt-1 text-sm">Mengalihkan ke halaman login...</p>
      </section>
    );
  }

  return (
    <section className="p-6">
      <Toaster />
      <h1 className="mb-4 text-2xl font-bold text-indigo-900">Log Aktivitas</h1>

      {loading ? (
        <p className="text-center text-gray-600">Memuat log...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm text-gray-800 divide-y divide-gray-200">
            <thead className="text-white bg-indigo-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-left">Email</th>
                <th className="px-4 py-3 font-semibold text-left">User ID</th>
                <th className="px-4 py-3 font-semibold text-left">Tindakan</th>
                <th className="px-4 py-3 font-semibold text-left">Message</th>
                <th className="px-4 py-3 font-semibold text-left">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-2">{log.email}</td>
                  <td className="px-4 py-2">{log.userId}</td>
                  <td className="px-4 py-2">
                    {log.action} on <strong>{log.tableName}</strong>
                  </td>
                  <td className="px-4 py-2">{log.message}</td>
                  <td className="px-4 py-2">{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminComp;
