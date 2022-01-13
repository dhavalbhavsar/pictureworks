import React, { Component } from "react";
import { Table, Button } from "reactstrap";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from "react-sortable-hoc";
import axiosConfig from "../../axiosConfig";
import "./CSS/Task.css";

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
      noDataFound: ""
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

  render() {
    const { noDataFound, tasks } = this.state;

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
              >
                Edit
              </Button>{" "}
              <Button
                className="action-button-completed"
                size="sm"
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
              <tr colSpan="3">{noDataFound}</tr>
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
