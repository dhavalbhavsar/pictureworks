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

export default class Edit extends Component {
  render() {
    let errorLabel = [];
    if (this.props.createTaskError) {
      if (Object.hasOwn(this.props.createTaskError, "label")) {
        errorLabel = this.props.createTaskError.label;
      }
    }

    return (
      <div>
        <Modal
          isOpen={this.props.editTaskModal}
          toggle={this.props.toggleEditTaskModal}
        >
          <ModalHeader toggle={this.props.toggleEditTaskModal}>
            Update Task
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="label">Label*</Label>
              <Input
                id="label"
                name="label"
                value={this.props.editTaskData.label}
                onChange={this.props.onChangeEditTaskHanler}
                className={errorLabel.length > 0 ? `is-invalid` : ``}
              />
              <span className="error text-danger">
                {errorLabel.length > 0 &&
                  errorLabel.map((error, i) => <p key={i}>{error}</p>)}
              </span>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={this.props.updateTask}
              className="action-button-create-edit edit-button"
            >
              Update
            </Button>
            <Button
              onClick={this.props.toggleEditTaskModal}
              className="action-button-cancel"
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
