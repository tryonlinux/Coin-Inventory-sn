import React from 'react';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InventoryList from './InventoryList';
import InventoryItem from './InventoryItem';
import JSONToCSVConvertor from '../lib/JSONToCSV';
import { PlusCircleIcon, GearIcon } from '@primer/octicons-react';
import Settings from './Settings';

const initialState = {
  loaded: false,
  parseError: false,
  addInventory: false,
  editInventory: false,
  editID: '',
  data: {
    inventory: [],
    locations: [],
    types: [],
    grades: [],
    mints: [],
  },
};

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    //test data
    // this.state.data.locations = [
    //   'Master Bedroom',
    //   'Office',
    //   'Safe 1',
    //   'Safe 2',
    // ];
    // this.state.data.types = ['Mint', 'Proof', 'Uncirculated', 'Circulated'];
    // this.state.data.mints = [
    //   'Philadelphia',
    //   'Denver',
    //   'San Francisco',
    //   'West Point',
    // ];
    // this.state.data.grades = ['70', '69', '68', '67', '66', '65'];

    this.configureEditorKit();

    this.saveNote = this.saveNote.bind(this);
    this.saveInventory = this.saveInventory.bind(this);
    this.onCancelAddInventory = this.onCancelAddInventory.bind(this);
    this.addInventory = this.addInventory.bind(this);
    this.updateInventory = this.updateInventory.bind(this);
    this.saveInventory = this.saveInventory.bind(this);
    this.displayEditForm = this.displayEditForm.bind(this);
    this.deleteInventoryItem = this.deleteInventoryItem.bind(this);
    this.onAddInventory = this.onAddInventory.bind(this);
    this.addSetting = this.addSetting.bind(this);
    this.deleteSetting = this.deleteSetting.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
  }

  configureEditorKit = () => {
    let delegate = new EditorKitDelegate({
      setEditorRawText: (text) => {
        this.setState({ ...initialState });
        //let parseError = false;
        let entries = [];
        if (text) {
          try {
            entries = JSON.parse(text);
          } catch (e) {
            // Couldn't parse the content
            //parseError = true;
            this.setState({
              loaded: true,
              parseError: true,
            });
          }
        }
        if (entries.length > 0 && entries[0].data.inventory) {
          this.setState(
            {
              loaded: true,
              addInventory: false,
              editInventory: false,
              data: {
                inventory: entries[0].data.inventory,
                locations: entries[0].data.locations,
                types: entries[0].data.types,
                mints: entries[0].data.mints,
                grades: entries[0].data.grades,
              },
            },
            () => alert(JSON.stringify(this.state))
          );
        } else {
          this.setState({
            loaded: true,
            addInventory: false,
            editInventory: false,
          });
        }
      },
      clearUndoHistory: () => {},
      getElementsBySelector: () => [],
      generateCustomPreview: (text) => {
        let entries = [];
        try {
          entries = JSON.parse(text);
        } finally {
          // eslint-disable-next-line no-unsafe-finally
          return {
            html: `<div>${entries[0].data.inventory.length}</div>`,
            plain: `${entries[0].data.inventory.length}`,
          };
        }
      },
    });

    this.editorKit = new EditorKit({
      delegate: delegate,
      mode: 'json',
      supportsFilesafe: false,
    });
  };

  saveNote(entries) {
    this.editorKit.onEditorValueChanged(JSON.stringify(entries));
  }

  onAddInventory = () => {
    this.setState({
      addInventory: true,
      editInventory: false,
    });
  };
  onCancelAddInventory = () => {
    this.setState({
      addInventory: false,
      editInventory: false,
      editID: '',
    });
  };

  saveInventory() {
    this.saveNote([
      {
        data: {
          inventory: this.state.data.inventory,
          locations: this.state.data.locations,
          types: this.state.data.types,
          mints: this.state.data.mints,
          grades: this.state.data.grades,
        },
      },
    ]);
  }

  addInventory(
    id,
    year,
    name,
    location,
    type,
    grade,
    mint,
    purchasedAmount,
    purchasedDate,
    estimatedValue,
    notes,
    filesafePictures
  ) {
    let data = this.state.data;
    data.inventory.push({
      id: id,
      year: year,
      name: name,
      location: location,
      type: type,
      grade: grade,
      mint: mint,
      purchasedAmount: purchasedAmount,
      purchasedDate: purchasedDate,
      estimatedValue: estimatedValue,
      notes: notes,
      filesafePictures: filesafePictures,
    });
    this.setState({ data, addInventory: false });
    this.saveInventory();
  }
  updateInventory(
    id,
    year,
    name,
    location,
    type,
    grade,
    mint,
    purchasedAmount,
    purchasedDate,
    estimatedValue,
    notes,
    filesafePictures
  ) {
    let data = this.state.data;
    let inventory = data.inventory;
    let index = inventory.findIndex((x) => x.id === id);
    inventory.splice(index, 1);
    inventory.push({
      id,
      year,
      name,
      location,
      type,
      grade,
      mint,
      purchasedAmount,
      purchasedDate,
      estimatedValue,
      notes,
      filesafePictures,
    });
    data.inventory = inventory;
    this.setState({ data, addInventory: false, editInventory: false });
    this.saveInventory();
  }

  displayEditForm(id) {
    this.setState({
      addInventory: false,
      editInventory: true,
      editID: id,
    });
  }

  deleteInventoryItem(id) {
    this.setState(
      (prevState) => {
        let data = { ...prevState.data };
        let index = data.inventory.findIndex((x) => x.id === id);
        let inventory = data.inventory
          .slice(0, index)
          .concat(data.inventory.slice(index + 1));
        data = { ...data, inventory };
        return {
          data,
          addInventory: false,
          editInventory: false,
        };
      },
      () => this.saveInventory()
    );
  }

  addSetting(setting, whichSetting) {
    if (setting === '' || setting === undefined) {
      alert('Connect add blank setting!');
    } else {
      if (!this.state.data[whichSetting].includes(setting)) {
        let newSettings = this.state.data[whichSetting].concat(setting);
        let newData = this.state.data;
        newData[whichSetting] = newSettings;
        this.setState({ data: newData }, () => {
          this.saveInventory();
        });
      } else {
        alert('Setting already exists!');
      }
    }
  }
  deleteSetting(setting, whichSetting) {
    let newSettings = this.state.data[whichSetting];
    const index = newSettings.indexOf(setting);
    if (index > -1 && setting !== '' && setting !== undefined) {
      newSettings.splice(index, 1);
      let newData = this.state.data;
      newData[whichSetting] = newSettings;
      this.setState({ data: newData }, () => {
        this.saveInventory();
      });
    } else {
      alert('Error Deleting setting!');
    }
  }
  toggleSettings() {
    this.setState({
      displaySettings: !this.state.displaySettings,
    });
  }

  render() {
    return (
      <div className="sn-component">
        <div>
          <div className="sk-panel"></div>
        </div>
        <div id="header">
          <Row>
            <Col>
              <Button onClick={this.onAddInventory} variant="dark">
                <PlusCircleIcon size={16} onClick={this.onAddInventory} />
              </Button>
            </Col>
            <Col>
              <Button
                variant="success"
                onClick={() =>
                  JSONToCSVConvertor(
                    this.state.data.inventory,
                    'Coin Inventory',
                    true
                  )
                }
              >
                Export
              </Button>
            </Col>
            <Col>
              <Button onClick={this.toggleSettings} variant="success">
                <GearIcon size={16} />
              </Button>
            </Col>
          </Row>
        </div>
        <div id="content">
          {this.state.displaySettings ? (
            <Settings
              addSetting={this.addSetting}
              deleteSetting={this.deleteSetting}
              settings={this.state.data}
              toggleSettings={this.toggleSettings}
            />
          ) : this.state.loaded ? (
            this.state.addInventory ? (
              <InventoryItem
                locations={this.state.data.locations}
                types={this.state.data.types}
                grades={this.state.data.grades}
                mints={this.state.data.mints}
                onCancelAddInventory={this.onCancelAddInventory}
                handleSubmit={this.addInventory}
                editMode={false}
              />
            ) : this.state.editInventory ? (
              <InventoryItem
                locations={this.state.data.locations}
                types={this.state.data.types}
                grades={this.state.data.grades}
                mints={this.state.data.mints}
                onCancelAddInventory={this.onCancelAddInventory}
                handleSubmit={this.updateInventory}
                editMode={true}
                editID={this.state.editID}
                inventory={this.state.data.inventory}
              />
            ) : (
              <InventoryList
                inventory={this.state.data.inventory}
                deleteInventory={this.deleteInventoryItem}
                handleSaveInventory={this.saveInventory}
                updateInventory={this.displayEditForm}
              />
            )
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    );
  }
}
