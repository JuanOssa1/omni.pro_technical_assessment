import * as yup from "yup";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import { TextField } from "@mui/material";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  addTask,
  addDbTask,
  selectActiveTsk,
  selectTaskIsEditing,
  isEditing,
  setTask
} from "./taskSlice";
import { close } from "../ui/modalSlice";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { Task, TaskFormData } from "./types";
import { TaskPriority } from "../../shared/constants";
import { TaskState } from "../../shared/constants";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useParams } from "react-router-dom";
import { AppDispatch } from "../../app/store";
import { useAppSelector } from "../../app/hooks";

const validationSchema: yup.ObjectSchema<TaskFormData> = yup.object().shape({
  taskName: yup.string().required("Title is required"),
  taskPriority: yup.mixed(),
  taskState: yup.mixed(),
  taskDescription: yup.string(),
  taskAssignedTo: yup.string(),
  taskCreationDate: yup.mixed(),
  taskEndDate: yup.mixed()
});
const textFieldStyle = {
  marginBottom: "13px"
};

export const TaskForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentTask = useAppSelector(selectActiveTsk);
  const isEditingTask = useAppSelector(selectTaskIsEditing);
  const { projectId } = useParams();
  const setDefaultValues = () => {
    let defaultValues = {};
    if (isEditingTask) {
      defaultValues = {
        taskName: currentTask?.taskName,
        taskPriority: currentTask?.taskPriority,
        taskState: currentTask?.taskState,
        taskDescription: currentTask?.taskDescription,
        taskAssignedTo: currentTask?.taskAssignedTo,
        taskCreationDate: dayjs(new Date()),
        taskEndDate: dayjs(new Date())
      };
    } else {
      defaultValues = {
        taskName: undefined,
        taskPriority: undefined,
        taskState: undefined,
        taskDescription: undefined,
        taskAssignedTo: undefined,
        taskCreationDate: dayjs(new Date()),
        taskEndDate: dayjs(new Date())
      };
    }
    return defaultValues;
  };
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<TaskFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: setDefaultValues()
  });
  const onSubmit = (values: TaskFormData) => {
    const taskId =
      Date.now().toString(36) + Math.random().toString(36).slice(2);

    const newTask: Task = {
      taskName: values.taskName,
      taskPriority: values.taskPriority,
      taskState: values.taskState,
      taskDescription: values.taskDescription,
      taskAssignedTo: values.taskAssignedTo,
      taskCreationDate: values.taskCreationDate?.toDate().toDateString(),
      taskEndDate: values.taskEndDate?.toDate().toLocaleDateString(),
      taskId,
      projectId: projectId!
    };

    if (isEditingTask && currentTask) {
      const updatedTask = { ...newTask, taskId: currentTask?.taskId };
      dispatch(addDbTask(updatedTask));
      dispatch(setTask(updatedTask));
    } else {
      dispatch(addDbTask(newTask));
      dispatch(addTask(newTask));
    }
    dispatch(close());
    dispatch(isEditing(false));
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="taskName"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="taskName"
              name="taskName"
              label="Title*"
              error={!!errors.taskName}
              helperText={errors.taskName?.message}
              sx={textFieldStyle}
            />
          )}
        />
        <Controller
          name="taskPriority"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl
              sx={{
                ...textFieldStyle,
                width: "49%",
                marginRight: "1%"
              }}
            >
              <InputLabel>Priority</InputLabel>
              <Select
                {...field}
                id="taskPriority"
                name="taskPriority"
                label="Priority"
                error={!!errors.taskPriority}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={TaskPriority.High}>High</MenuItem>
                <MenuItem value={TaskPriority.Medium}>Medium</MenuItem>
                <MenuItem value={TaskPriority.Low}>Low</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="taskState"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl
              sx={{
                ...textFieldStyle,
                width: "49%",
                marginLeft: "1%"
              }}
            >
              <InputLabel>Status</InputLabel>
              <Select
                {...field}
                id="taskState"
                name="taskState"
                label="Status"
                error={!!errors.taskState}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={TaskState.Complete}>Complete</MenuItem>
                <MenuItem value={TaskState.Pending}>Pending</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="taskDescription"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              id="taskDescription"
              name="taskDescription"
              label="Description"
              error={!!errors.taskDescription}
              helperText={errors.taskDescription?.message}
              sx={textFieldStyle}
            />
          )}
        />
        <Controller
          name="taskAssignedTo"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="taskAssignedTo"
              name="taskAssignedTo"
              label="Assigned To"
              error={!!errors.taskAssignedTo}
              helperText={errors.taskAssignedTo?.message}
              sx={textFieldStyle}
            />
          )}
        />
        <Controller
          name="taskCreationDate"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                {...field}
                disabled
                fullWidth
                id="taskCreationDate"
                label="Creation Date"
                error={!!errors.taskCreationDate}
                helperText={errors.taskCreationDate?.message}
                format="DD-MM-YYYY"
                sx={{ ...textFieldStyle, width: "49%", marginRight: "1%" }}
              />
            </LocalizationProvider>
          )}
        />
        <Controller
          name="taskEndDate"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                {...field}
                fullWidth
                id="taskEndDate"
                label="Task end date"
                format="DD-MM-YYYY"
                error={!!errors.taskEndDate}
                helperText={errors.taskEndDate?.message}
                sx={{ ...textFieldStyle, width: "49%", marginLeft: "1%" }}
              />
            </LocalizationProvider>
          )}
        />

        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Button color="primary" variant="contained" fullWidth type="submit">
            Submit
          </Button>
          <Button
            color="primary"
            variant="contained"
            sx={{ marginLeft: "7px" }}
            onClick={() => {
              dispatch(close());
              dispatch(isEditing(false));
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </>
  );
};
