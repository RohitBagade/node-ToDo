import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/task.js";

export const newTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    await Task.create({
      title,
      description,
      user: req.user,
    });

    res.status(201).json({
      success: true,
      message: "Task added Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const userid = req.user._id;

    const tasks = await Task.find({
      user: userid,
    });

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) return next(new ErrorHandler("Task Not Found", 404, false));

    task.isCompleted = !task.isCompleted;

    await task.save();

    next(new ErrorHandler("Task Updated", 200, true));
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) return next(new ErrorHandler("Task Not Found", 404, false));

    await task.deleteOne();

    next(new ErrorHandler("Task Deleted", 200, true));
  } catch (error) {
    next(error);
  }
};
