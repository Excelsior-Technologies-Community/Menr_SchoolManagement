import api from "./api";

// =========================================================
// GET ALL ATTENDANCE
// =========================================================

export const getAttendance = async () => {
  const response = await api.get("/attendance");
  return response.data;
};


// =========================================================
// GET ATTENDANCE BY CLASS / SECTION / BATCH / DATE
// =========================================================

export const getAttendanceByGroup = async ({
  schoolClassId,
  sectionId,
  batchId,
  attendanceDate
}) => {

  const response = await api.get(
    "/attendance/group",
    {
      params: {
        schoolClassId,
        sectionId,
        batchId,
        attendanceDate
      }
    }
  );

  return response.data;
};


// =========================================================
// MARK ATTENDANCE
// =========================================================

export const markAttendance = async (data) => {

  const response = await api.post(
    "/attendance",
    data
  );

  return response.data;
};


// =========================================================
// UPDATE ATTENDANCE
// =========================================================

export const updateAttendance = async (
  id,
  data
) => {

  const response = await api.put(
    `/attendance/${id}`,
    data
  );

  return response.data;
};