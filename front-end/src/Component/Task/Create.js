import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import "./CSS/Task.css";

export default class Create extends Component {
  
  render() {
    let errorLabel = [];
    if (this.props.createTaskError) {
      if (Object.hasOwn(this.props.createTaskError, "label")) {
        errorLabel = this.props.createTaskError.label;
      }
    }

    return (
      <div>
        <Button
          className="float-right mb-4 action-button-create-edit"
          onClick={this.props.toggleNewTaskModal}
        >
          Add Task
        </Button>
        <Modal
          isOpen={this.props.newTaskModal}
          toggle={this.props.toggleNewTaskModal}
        >
          <ModalHeader toggle={this.props.toggleNewTaskModal}>
            Add Task
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="label">Label*</Label>
              <Input
                id="label"
                name="label"
                value={this.props.newTaskData.label}
                onChange={this.props.onChangeAddTaskHandler}
                className={errorLabel.length > 0 ? `is-invalid` : `asd`}
              />

              <span className="error text-danger">
                {errorLabel.length > 0 &&
                  errorLabel.map((error, i) => <p key={i}>{error}</p>)}
              </span>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              className="action-button-create-edit add-button"
              onClick={() => this.props.addTask()}
            >
              Add
            </Button>
            <Button
              className="action-button-cancel"
              onClick={this.props.toggleNewTaskModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
