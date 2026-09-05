import api from "./api";


// =========================================================
// GET ALL CLASS ATTENDANCE STATUS
// =========================================================

export const getClassAttendanceStatuses = async (
  schoolId
) => {

  const response =
    await api.get(
      "/attendance-v2/class-status",
      {
        params: {
          school_id: schoolId
        }
      }
    );

  return response.data;
};

// =========================================================
// GET CLASS ATTENDANCE STATUS
// CLASS + SECTION + DATE
// =========================================================

export const getClassAttendanceStatus = async ({
  classId,
  sectionId,
  date
}) => {

  const response =
    await api.get(
      `/attendance-v2/class-status/${classId}/${sectionId}/${date}`
    );

  return response.data;
};


// =========================================================
// CREATE CLASS ATTENDANCE STATUS
// INITIAL STATUS = Pending
// =========================================================

export const createClassAttendanceStatus =
async (data) => {

  const response =
    await api.post(
      "/attendance-v2/class-status",
      data
    );

  return response.data;
};


// =========================================================
// UPDATE / SUBMIT CLASS ATTENDANCE STATUS
// =========================================================

export const updateClassAttendanceStatus =
async (
  id,
  data
) => {

  const response =
    await api.put(
      `/attendance-v2/class-status/${id}`,
      data
    );

  return response.data;
};