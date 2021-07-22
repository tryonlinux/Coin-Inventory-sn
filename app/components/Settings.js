import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';

const initialState = {
  settingSelected: '',
  addValue: '',
  whichSettings: 'locations',
};
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toTitleCase = this.toTitleCase.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState(
      {
        [name]: value,
      },
      () => {
        if (name === 'whichSettings') {
          this.setState({
            settingSelected: this.props.settings[this.state.whichSettings][0],
          });
        }
      }
    );
  }
  addNewSetting() {
    this.props.addSetting(this.state.addValue, this.state.whichSettings);
    this.setState({
      addValue: '',
    });
  }
  deleteSetting() {
    this.props.deleteSetting(
      this.state.settingSelected,
      this.state.whichSettings
    );
    this.setState({
      settingSelected: this.props.settings[this.state.whichSettings][0],
    });
  }
  toTitleCase(str) {
    if (str !== undefined) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    } else {
      return '';
    }
  }
  componentDidMount() {
    this.setState({
      settingSelected: this.props.settings[this.state.whichSettings][0],
    });
  }
  render() {
    return (
      <div>
        <Row>
          <Col>
            <Form>
              <Form.Group controlId="whichSettings">
                <Form.Label>
                  {this.toTitleCase(this.state.whichSettings)}
                </Form.Label>
                <Form.Control
                  as="select"
                  name="whichSettings"
                  onChange={this.handleInputChange}
                  value={this.state.whichSettings}
                >
                  <option key={'locations'} value={'locations'}>
                    Location
                  </option>
                  <option key={'mints'} value={'mints'}>
                    Mint
                  </option>
                  <option key={'grades'} value={'grades'}>
                    Grade
                  </option>
                  <option key={'types'} value={'types'}>
                    Type
                  </option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              <Form.Group controlId="settingSelected">
                <Form.Label>
                  {this.toTitleCase(this.state.whichSettings)}
                </Form.Label>
                <Form.Control
                  as="select"
                  name="settingSelected"
                  htmlSize="5"
                  onChange={this.handleInputChange}
                  value={this.state.settingSelected}
                >
                  {this.props.settings[this.state.whichSettings].map((row) => (
                    <option key={row} value={row}>
                      {row}
                    </option>
                  ))}
                </Form.Control>
                <Button variant="danger" onClick={() => this.deleteSetting()}>
                  Delete Selected Setting
                </Button>
              </Form.Group>
            </Form>
          </Col>
          <Col>
            <Form>
              <Form.Group controlId="addValue">
                <Form.Label>
                  Add {this.toTitleCase(this.state.whichSettings)}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Setting"
                  name="addValue"
                  value={this.state.addValue}
                  onChange={this.handleInputChange}
                />
                <Button variant="success" onClick={() => this.addNewSetting()}>
                  Add New Setting
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              variant="secondary"
              onClick={() => this.props.toggleSettings()}
            >
              Close Settings
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Settings;
Settings.propTypes = {
  settings: PropTypes.object,
  addSetting: PropTypes.func,
  deleteSetting: PropTypes.func,
  toggleSettings: PropTypes.func,
};
