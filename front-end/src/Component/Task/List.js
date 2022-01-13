import React, { Component } from "react";
import { Table, Button } from "reactstrap";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from "react-sortable-hoc";
import axiosConfig from "../../axiosConfig";
import "./CSS/Task.css";
import CreateTask from "./Create";
import EditTask from "./Edit";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

const SortableCont = SortableContainer(({ children }) => {
  return <tbody>{children}</tbody>;
});

const SortableItem = SortableElement(({ children, key }) => {
  return <tr>{children}</tr>;
});

export default class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      noDataFound: "",
      newTaskData: {
        label: "",
      },
      isLoading: false,
      status: "",
      newTaskModal: false,
      createTaskError: {},
      editTaskData: {
        label: "",
      },
      editTaskModal: false,
    };
  }

  componentDidMount() {
    this.getTasks();
  }

  getTasks() {
    axiosConfig.get("/api/task").then((response) => {
      if (response.status === 200) {
        this.setState({
          tasks: response.data.data ? response.data.data : [],
        });
      }
      if (response.data.data.length === 0) {
        this.setState({
          noDataFound: "No record found.",
        });
      }
    });
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { tasks } = this.state;
    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    let taskList = [];
    newTasks.forEach((task) => {
      taskList.push(task.id);
    });
    this.setState(() => ({
      tasks: newTasks,
    }));
    axiosConfig
      .post("/api/task/update-order", {
        sort_order: taskList,
      })
      .then((response) => {});
  };

  toggleNewTaskModal = () => {
    this.setState({
      newTaskModal: !this.state.newTaskModal,
      createTaskError: {},
    });
  };

  onChangeAddTaskHandler = (e) => {
    let { newTaskData } = this.state;
    newTaskData[e.target.name] = e.target.value;
    this.setState({ newTaskData });
  };

  addTask = () => {
    axiosConfig
      .post("/api/task", this.state.newTaskData)
      .then((response) => {
        const { tasks } = this.state;
        const newTasks = [...tasks];
        newTasks.push(response.data);
        this.setState(
          {
            tasks: newTasks,
            newTaskModal: false,
            newTaskData: {
              label: "",
            },
          },
          () => this.getTasks()
        );
        toast.success(response.data.message);
      })
      .catch((error) => {
        if (error.response.data.errors) {
          let { createTaskError } = this.state;
          createTaskError = error.response.data.errors;
          this.setState({ createTaskError });
        }
      });
  };

  toggleEditTaskModal = () => {
    this.setState({
      editTaskModal: !this.state.editTaskModal,
      createTaskError: {},
    });
  };

  onChangeEditTaskHanler = (e) => {
    let { editTaskData } = this.state;
    editTaskData[e.target.name] = e.target.value;
    this.setState({ editTaskData });
  };

  editTask = (id, label) => {
    this.setState({
      editTaskData: { id, label },
      editTaskModal: !this.state.editStudentModal,
    });
  };

  updateTask = () => {
    let { id, label } = this.state.editTaskData;
    this.setState({
      isLoading: true,
    });
    axiosConfig
      .put("/api/task/" + id, {
        label,
      })
      .then((response) => {
        this.getTasks();
        this.setState({
          editTaskModal: false,
          editTaskData: { label },
          isLoading: false,
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        if (error.response.data.errors) {
          let { createTaskError } = this.state;
          createTaskError = error.response.data.errors;
          this.setState({ createTaskError });
        }
      });
  };

  completeTask = (id, type) => {
    axiosConfig
      .post("/api/task/completed/" + id + "/" + type, {})
      .then((response) => {
        this.getTasks();
        toast.success(response.data.message);
      });
  };

  render() {
    const { createTaskError, newTaskData, editTaskData, noDataFound, tasks } =
      this.state;

    let taskDetail = [];
    if (tasks.length) {
      taskDetail = tasks.map((task, index) => {
        return (
          <SortableItem key={`item-${task.id}`} index={index}>
            <td>{task.label}</td>
            <td>
              {task.created_at}{" "}
              {task.completed_at !== null ? `- ` + task.completed_at : ``}
            </td>
            <td>
              <Button
                className="mr-3 action-button-create-edit"
                size="sm"
                onClick={() => this.editTask(task.id, task.label)}
              >
                Edit
              </Button>{" "}
              <Button
                className="action-button-completed"
                size="sm"
                onClick={() =>
                  this.completeTask(
                    task.id,
                    task.completed_at == null ? `complete` : `incomplete`
                  )
                }
              >
                Mark As {task.completed_at == null ? `Complete` : `Incomplete`}
              </Button>
            </td>
          </SortableItem>
        );
      });
    }

    return (
      <div className="App container mt-4">
        <h4 className="font-weight-bold">List of tasks</h4>
        <CreateTask
          toggleNewTaskModal={this.toggleNewTaskModal}
          newTaskModal={this.state.newTaskModal}
          onChangeAddTaskHandler={this.onChangeAddTaskHandler}
          addTask={this.addTask}
          newTaskData={newTaskData}
          createTaskError={createTaskError}
        />
        <EditTask
          toggleEditTaskModal={this.toggleEditTaskModal}
          editTaskModal={this.state.editTaskModal}
          onChangeEditTaskHanler={this.onChangeEditTaskHanler}
          editTask={this.editTask}
          editTaskData={editTaskData}
          updateTask={this.updateTask}
          createTaskError={createTaskError}
        />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Label</th>
              <th>Task Created - Task Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          {tasks.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan="3">{noDataFound}</td>
              </tr>
            </tbody>
          ) : (
            <SortableCont tasks={tasks} onSortEnd={this.onSortEnd}>
              {taskDetail}
            </SortableCont>
          )}
        </Table>
      </div>
    );
  }
}
