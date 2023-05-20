const User = require("../models/user");
const Ticket = require("../models/ticket");
const Clinic = require("../models/clinic");
const UserLogin = require("../models/login");
const Task = require("../models/task");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "sdhflksdhkjkjdkjvdjfdb";
const JWT_REFRESH_SECRET="sakjdhasljddowq"

//authentication for other pages----------------------------------------------------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

//...................................................USER
//post user data
const postData = async (req, res, next) => {
  try {
    const {
      photo,
      firstName,
      lastName,
      contactEmail,
      position,
      dateOfBirth,
      sex,
      mobilePhone,
      city,
      department,
      country,
      region,
      status,
    } = req.body;

    let statusText = "";
    switch (status) {
      case "0":
        statusText = "online";
        break;
      case "1":
        statusText = "break";
        break;
      case "2":
        statusText = "away";
        break;
      case "3":
        statusText = "don't disturb";
        break;
      default:
        statusText = "unknown";
        break;
    }

    const savedUser = await User.create({
      photo,
      firstName,
      lastName,
      contactEmail,
      position,
      dateOfBirth,
      sex,
      mobilePhone,
      city,
      department,
      country,
      region,
      status: statusText,
    });

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
};

//get user data-----------------------------------------------------------------
const getData = async (req, res, next) => {
  try {
    const users = await User.find();
    if (users.length > 0) {
      res.send(users);
    } else {
      res.send({ result: "no users found" });
    }
  } catch (error) {
    next(error);
  }
};

//get current User Data-----------------------------------------------------------

const getCurrentUserData = async (req, res, next) => {
  let result = await User.findById({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "no record" });
  }
};

//.........................................................................TICKET
//post Ticket information
const postTicket = (req, res, next) => {
  try {
    const user = new Ticket(req.body);
    user.save();
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
};
//get ticket information-----------------------------------------------------------------------------
const getTicketData = async (req, res, next) => {
  try {
    const users = await Ticket.find();
    if (users.length > 0) {
      res.send(users);
    } else {
      res.send({ result: "no ticket info. found" });
    }
  } catch (error) {
    next(error);
  }
};

//................................................................  CLINIC
//post clinic data
const postClinic = (req, res, next) => {
  const user = new Clinic(req.body);
  const result = user.save();
  res.send(result);
};
//get clinic data
const getClinicData = async (req, res, next) => {
  try {
    const users = await Clinic.find();
    if (users.length > 0) {
      res.send(users);
    } else {
      res.send({ result: "no ticket info. found" });
    }
  } catch (error) {
    next(error);
  }
};

//user login and create access token.....................................................................
// const loginUser = async (req, res, next) => {
//   const { email, password } = req.body;
//   const user = await UserLogin.findOne({ email });
//   if (!user) {
//     return res.status(401).json({ error: "Invalid email or password" });
//   }
//   if (user.password !== password) {
//     return res.status(403).json({ error: "Invalid password" });
//   }
//   const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
//   const refreshToken = jwt.sign({ userId: user._id }, "YOUR_REFRESH_SECRET", { expiresIn: "7d" });
//   res.json({
//     status: 200,
//     message: "success",
//     data: {
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       phone: user.phone,
//       userRole: user.userRole,
//       clinicName: user.clinicName,
//       clinicCode: user.clinicCode,
//       clinicBlock: user.clinicBlock,
//       token: token,
//       refreshToken: refreshToken,
//     },
//   });
// };
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

const bcrypt = require('bcrypt');

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserLogin.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(403).json({ error: "Invalid password" });
  }
  const accessToken = generateAccessToken(user._id);
  const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
  res.json({
    status: 200,
    message: "success",
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      userRole: user.userRole,
      clinicName: user.clinicName,
      clinicCode: user.clinicCode,
      clinicBlock: user.clinicBlock,
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  });
};


// Refresh Token endpoint-------------------------------------------------------------------------------------------
const refreshAccessToken = (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token not provided" });
  }
  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }
    const accessToken = generateAccessToken(decoded.userId);
    res.json({
      status: 200,
      message: "success",
      data: {
        accessToken: accessToken,
      },
    });
  });
};



//add task.....................................................

const addTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the task" });
  }
};

//completed task..................................................
const completeTask = async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.status = 5; // Set status to "Completed"
    const completedTask = await task.save();

    res.status(200).json(completedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to complete the task" });
  }
};

//getTask----------------------------------------------------------------------------------------------
const getTask = async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve task data" });
  }
};

//getTaskData by createdBy or responsible or participant or observers-----------------------------------------------
const getTaskData = async (req, res) => {
  try {
    // Check if the user is logged in
    const loggedInUserId = req.user.userId; // Assuming the user ID is available in the request after authentication
    console.log(loggedInUserId)
    // Find the tasks associated with the logged-in user
    const tasks = await Task.find({
      $or: [
        { createdBy: loggedInUserId },
        { responsible: loggedInUserId },
        { participant: loggedInUserId },
        { observers: loggedInUserId }
      ]
    });

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found for the user' });
    }

    // Return the task data in the response
    res.json({
      status: 200,
      message: 'success',
      data: tasks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve task data' });
  }
};

  

//getTask by status-------------------------------------------------------------------------------
const getTaskByStatus = async (req, res) => {
  try {
    // Check if the user is logged in
    const loggedInUserId = req.user.userId; // Assuming the user ID is available in the request after authentication

    const { status } = req.params; // Assuming the status is provided as a query parameter

    // Find the tasks associated with the logged-in user and matching status
    const tasks = await Task.find({
      $or: [
        { createdBy: loggedInUserId },
        { responsible: loggedInUserId },
        { participant: loggedInUserId },
        { observers: loggedInUserId }
      ],
      status: status // Filter tasks based on the provided status
    });

    if (tasks.length === 0) {
      return res.status(404).json({ error: "No tasks found with the given status" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve task data" });
  }
};

// const getTaskByStatus = async (req, res) => {
//   const status = req.params.status;

//   try {
//     const tasks = await Task.find({ status: status });

//     if (tasks.length === 0) {
//       return res.status(404).json({ error: "No tasks found with the given status" });
//     }

//     res.status(200).json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve task data" });
//   }
// };


//gettingTaskData for 30days-----------------------------------------------------------------------------------------------
const getTaskDataLast30Days = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId
    console.log(loggedInUserId);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const tasks = await Task.find({
      $or: [
        { createdBy: loggedInUserId },
        { responsible: loggedInUserId },
        { participant: loggedInUserId },
        { observers: loggedInUserId }
      ],
      dateCreated: { $gte: thirtyDaysAgo }
    });

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found within the last 30 days' });
    }

    res.json({
      status: 200,
      message: 'success',
      data: tasks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve task data', details: error.message });
  }
};
const getTaskDataLast7Days = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId
    console.log(loggedInUserId);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 7);

    const tasks = await Task.find({
      $or: [
        { createdBy: loggedInUserId },
        { responsible: loggedInUserId },
        { participant: loggedInUserId },
        { observers: loggedInUserId }
      ],
      dateCreated: { $gte: thirtyDaysAgo }
    });

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found within the last 30 days' });
    }

    res.json({
      status: 200,
      message: 'success',
      data: tasks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve task data', details: error.message });
  }
};

const getTaskByRole = async (req, res) => {
  const { createdBy, responsible, participant, observers } = req.query;

  try {
    if (!createdBy && !responsible && !participant && !observers) {
      return res.status(400).json({ error: 'err' });
    }

    const query = {};

    if (createdBy) {
      query.createdBy = createdBy;
    }

    if (responsible) {
      query.responsible = responsible;
    }

    if (participant) {
      query.participant = participant;
    }

    if (observers) {
      query.observers = observers;
    }

    const tasks = await Task.find(query);
    
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found' });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve task data' });
  }
};





//pause task....................................................
const pauseTask = async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.status = 2; // Set status to "Pending"
    const pausedTask = await task.save();

    res.status(200).json(pausedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to pause the task" });
  }
};

//renew a task...........................................................
const renewTask = async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.status = 2; // Set status to "Pending"
    task.closedTask = 0; // Reset closedTask to 0
    task.closedOn = null; // Reset closedOn to null
    const renewedTask = await task.save();

    res.status(200).json(renewedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to renew the task' });
  }
};

//Add comment Task.................................................
const addResultFromComment = async (req, res) => {
  const taskId = req.params.taskId;
  const comment = req.body.comment;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.results.push(comment); // Add the comment to the task's results array
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add result from comment to the task' });
  }
};

//Start Task:------------------------------------------------

const startTask=async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.status = 3; // Set status to "In Progress"
    const progressTask = await task.save();

    res.status(200).json(progressTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to pause the task" });
  }
};

//Update Task-----------------------------------------------------------

const updateTask=async (req, res) => {
  const taskId = req.params.taskId;
  const updates = req.body;

  try {
    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};




module.exports = {
  postData,
  postTicket,
  postClinic,
  refreshAccessToken,

  getData,
  getCurrentUserData,
  getTicketData,
  getClinicData,
  getTask,
  getTaskByStatus,
  getTaskByRole,
  getTaskData,
  getTaskDataLast30Days,
  getTaskDataLast7Days,

  loginUser,
  authenticateToken,
  addTask,
  completeTask,
  pauseTask,
  renewTask,
  addResultFromComment,
  startTask,
  updateTask,
};
