import { useEffect, useState } from "react";

import {
  IndianRupee,
  CheckCircle,
  Clock,
  Receipt
} from "lucide-react";

import StudentLayout from "../../layouts/StudentLayout";

import {
  getStudentFees
} from "../../services/studentService";


function MyFees() {

  const [fees, setFees] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    fetchFees();

  }, []);


  const fetchFees = async () => {

    try {

      setLoading(true);

      const response =
        await getStudentFees();

      setFees(
        response.data?.fees
      );

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message ||
        "Unable to load fee details"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <StudentLayout>

      <div className="p-6 bg-slate-100 min-h-screen">


        <div className="mb-6">

          <h1 className="text-3xl font-bold text-slate-800">

            My Fees

          </h1>

          <p className="text-slate-500 mt-1">

            View your fee payment and pending amount.

          </p>

        </div>


        {loading && (

          <div className="bg-white rounded-xl p-12 text-center">

            Loading fee details...

          </div>

        )}


        {error && (

          <div className="bg-red-100 text-red-700 p-4 rounded-xl">

            {error}

          </div>

        )}


        {!loading && !error && fees && (

          <div className="space-y-6">


            {/* Fee Summary */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">


              <FeeCard
                icon={<IndianRupee />}
                title="Total Fee"
                value={fees.total_fee}
              />


              <FeeCard
                icon={<CheckCircle />}
                title="Paid Amount"
                value={fees.paid_amount}
              />


              <FeeCard
                icon={<Clock />}
                title="Due Amount"
                value={fees.due_amount}
              />


              <FeeCard
                icon={<Receipt />}
                title="Status"
                value={fees.status}
                isStatus
              />

            </div>


            {/* Payment Progress */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <div className="flex justify-between mb-3">

                <h2 className="font-bold text-slate-800">

                  Payment Progress

                </h2>

                <span className="font-semibold text-blue-600">

                  {fees.total_fee > 0
                    ? (
                        Number(fees.paid_amount) /
                        Number(fees.total_fee) *
                        100
                      ).toFixed(2)
                    : 0
                  }%

                </span>

              </div>


              <div className="w-full bg-slate-200 rounded-full h-4">

                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{
                    width: `${
                      fees.total_fee > 0
                        ? Math.min(
                            (
                              Number(fees.paid_amount) /
                              Number(fees.total_fee)
                            ) * 100,
                            100
                          )
                        : 0
                    }%`
                  }}
                />

              </div>

            </div>


            {/* Fee Details */}

            <div className="bg-white rounded-xl shadow-sm p-6">

              <h2 className="text-xl font-bold text-slate-800 mb-5">

                Fee Summary

              </h2>


              <div className="divide-y">


                <Row
                  label="Total Fee"
                  value={`₹ ${Number(
                    fees.total_fee || 0
                  ).toLocaleString("en-IN")}`}
                />


                <Row
                  label="Paid Amount"
                  value={`₹ ${Number(
                    fees.paid_amount || 0
                  ).toLocaleString("en-IN")}`}
                />


                <Row
                  label="Due Amount"
                  value={`₹ ${Number(
                    fees.due_amount || 0
                  ).toLocaleString("en-IN")}`}
                />


                <Row
                  label="Fee Records"
                  value={
                    fees.fee_records || 0
                  }
                />


                <Row
                  label="Payment Status"
                  value={
                    fees.status || "-"
                  }
                />

              </div>

            </div>


          </div>

        )}


        {!loading && !error && !fees && (

          <div className="bg-white rounded-xl p-12 text-center text-slate-500">

            No fee information available.

          </div>

        )}

      </div>

    </StudentLayout>

  );

}


function FeeCard({
  icon,
  title,
  value,
  isStatus = false
}) {

  return (

    <div className="bg-white rounded-xl shadow-sm p-6">

      <div className="flex items-center gap-3 mb-4">

        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">

          {icon}

        </div>

        <span className="text-slate-500">

          {title}

        </span>

      </div>


      <h2
        className={
          isStatus
            ? "text-2xl font-bold text-green-600"
            : "text-2xl font-bold text-slate-800"
        }
      >

        {isStatus
          ? value
          : `₹ ${Number(
              value || 0
            ).toLocaleString("en-IN")}`
        }

      </h2>

    </div>

  );

}


function Row({
  label,
  value
}) {

  return (

    <div className="flex justify-between items-center py-4">

      <span className="text-slate-500">

        {label}

      </span>

      <span className="font-semibold text-slate-800">

        {value}

      </span>

    </div>

  );

}


export default MyFees;