/* eslint-disable indent */
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
const initialState = {
  id: '',
  year: '',
  itemName: '',
  location: '',
  type: '',
  grade: '',
  mint: '',
  purchasedAmount: '',
  purchasedDate: '',
  estimatedValue: '',
  notes: '',
};

class InventoryItem extends Component {
  constructor(props) {
    super(props);
    if (this.props.editMode) {
      let currentInventoryItem =
        this.props.inventory[
          this.props.inventory.findIndex((x) => x.id === this.props.editID)
        ];
      this.state = {
        id: currentInventoryItem.id,
        year: currentInventoryItem.year,
        itemName: currentInventoryItem.name,
        location: currentInventoryItem.location,
        type: currentInventoryItem.type,
        grade: currentInventoryItem.grade,
        mint: currentInventoryItem.mint,
        purchasedAmount: currentInventoryItem.purchasedAmount,
        purchasedDate: currentInventoryItem.purchasedDate
          ? new Date(currentInventoryItem.purchasedDate)
              .toISOString()
              .split('T')[0]
          : '',
        estimatedValue: currentInventoryItem.estimatedValue,
        notes: currentInventoryItem.notes,
      };
    } else {
      this.state = initialState;
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value,
    });
  }
  render() {
    return (
      <div>
        <Form onSubmit={this.props.handleSubmit}>
          <Row>
            <Col>
              <h3 className="text-center">Please Enter Details of Coin</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="year">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Year"
                  name="year"
                  value={this.state.year}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="itemName">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Item Name"
                  name="itemName"
                  value={this.state.itemName}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="location">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  as="select"
                  name="location"
                  value={this.state.location}
                  onChange={this.handleInputChange}
                >
                  <option key={-1}> </option>
                  {this.props.locations.map((row) => (
                    <option key={row} value={row}>
                      {row}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  name="type"
                  value={this.state.type}
                  onChange={this.handleInputChange}
                >
                  <option key={-1}> </option>
                  {this.props.types.map((row) => (
                    <option key={row} value={row}>
                      {row}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="grade">
                <Form.Label>Grade</Form.Label>
                <Form.Control
                  as="select"
                  name="grade"
                  value={this.state.grade}
                  onChange={this.handleInputChange}
                >
                  <option key={-1}> </option>
                  {this.props.grades.map((row) => (
                    <option key={row} value={row}>
                      {row}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="mint">
                <Form.Label>Mint</Form.Label>
                <Form.Control
                  as="select"
                  name="mint"
                  value={this.state.mint}
                  onChange={this.handleInputChange}
                >
                  <option key={-1}> </option>
                  {this.props.mints.map((row) => (
                    <option key={row} value={row}>
                      {row}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="purchasedAmount">
                <Form.Label>Purchased Amount</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="$0.00"
                  name="purchasedAmount"
                  value={this.state.purchasedAmount}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Label>Purchased Date</Form.Label>
              <Form.Control
                type="date"
                name="purchasedDate"
                value={this.state.purchasedDate}
                onChange={this.handleInputChange}
              />
            </Col>
            <Col>
              <Form.Group controlId="estimatedValue">
                <Form.Label>Estimated Value</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="$0.00"
                  name="estimatedValue"
                  value={this.state.estimatedValue}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="notes">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Notes"
                  name="notes"
                  value={this.state.notes}
                  as="textarea"
                  rows={4}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                variant="success"
                onClick={() =>
                  this.props.handleSubmit(
                    this.state.id ? this.state.id : uuidv4(),
                    this.state.year,
                    this.state.itemName,
                    this.state.location,
                    this.state.type,
                    this.state.grade,
                    this.state.mint,
                    this.state.purchasedAmount,
                    this.state.purchasedDate,
                    this.state.estimatedValue,
                    this.state.notes,
                    []
                  )
                }
              >
                Save
              </Button>
            </Col>
            <Col>
              <Button
                className="float-right"
                onClick={this.props.onCancelAddInventory}
                variant="danger"
              >
                {' '}
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

InventoryItem.propTypes = {
  locations: PropTypes.array,
  types: PropTypes.array,
  grades: PropTypes.array,
  mints: PropTypes.array,
  onCancelAddInventory: PropTypes.func,
  handleSubmit: PropTypes.func,
  editMode: PropTypes.bool,
  inventory: PropTypes.array,
  editID: PropTypes.string,
};
export default InventoryItem;
