const User = require("../models/user");
const Ticket = require("../models/ticket");
const Clinic = require("../models/clinic");
const UserLogin = require("../models/login");
const Task = require("../models/task");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "sdhflksdhkjkjdkjvdjfdb";

//authentication for other pages
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

//get user data
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

//get current User Data

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
//get ticket information
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

//user login.....................................................................
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserLogin.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  if (user.password !== password) {
    return res.status(403).json({ error: "Invalid  password" });
  }
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({
    status: 200,
    message: "success",
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      userRole: user.userRole,
      clinicName: user.clinicName,
      clinicCode: user.clinicCode,
      clinicBlock: user.clinicBlock,
      token: token,
    },
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

//getTask............................
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

  getData,
  getCurrentUserData,
  getTicketData,
  getClinicData,
  getTask,

  loginUser,
  authenticateToken,
  addTask,
  completeTask,
  pauseTask,
  renewTask,
  addResultFromComment,
  startTask,
  updateTask
};
