import React, { Component } from 'react';
import $ from 'jquery'
import c8dbLogo from './macrometa-white-transparent.png';
import spinner from './circle_spinner.gif';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Config from './Config';

import {
  deleteUtil,
  addOrUpdateUtil,
  getBaseUrl,
  getWsUrl,
  getProducerUrl,
  makeRegionData
} from "./util";

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shouldShowModal: false,
      showSnackbar: false,
      isEdit: false,
      snackbarText: '',
      firstName: '',
      lastName: '',
      emailAddress: '',
      firstNameHasError: false,
      lastNameHasError: false,
      emailAddressHasError: false,
      data: [],
      isLoading: true,
      lastEditElem: null,
      selectedRegionUrl: "",
      selectedRegionName: "",
      regionModal: false,
      availableRegions: makeRegionData(Config),
      baseUrl: '',
      wsUrl: '',
      producerUrl: '',
      loginModal: true,
      email: "demo@macrometa.io",
      fabric: '_system',
      password: 'xxxx',
      wsotp: ''
    };

    this.onFabPress = this.onFabPress.bind(this);
    this.getOtp = this.getOtp.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.onSavePressed = this.onSavePressed.bind(this);
    this.resetModalData = this.resetModalData.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onTextInputFocus = this.onTextInputFocus.bind(this);
    this.onSocketMessageReceived = this.onSocketMessageReceived.bind(this);
    this.connection = undefined;
    this.producer = undefined;
    this.jwtToken = undefined;
    this.tenant = undefined;
  }

  componentWillUnmount() {
    this.connection.close();
    this.producer.close();
  }

  login() {
    const { email, password, selectedRegionUrl } = this.state;
    const self = this;
    const data = {
      email: email,
      password: password
    };

    const url = `https://api-${selectedRegionUrl}/_open/auth`;
    $.ajax({
      url,
      method: 'POST',
      data: JSON.stringify(data),
      dataType: 'json',
      success: (data) => {
        const { jwt, tenant } = data;
        this.jwtToken = jwt;
        this.tenant = tenant;
        this.setState({
          regionModal: false,
          baseUrl: getBaseUrl(selectedRegionUrl, this.tenant, this.state.fabric),
          wsUrl: getWsUrl(selectedRegionUrl, this.tenant, this.state.fabric),
          producerUrl: getProducerUrl(selectedRegionUrl, this.tenant, this.state.fabric)
        }, () => {
          this.ajaxSetup();
          this.initWebSocket();
          var collection = this.createCollection();
          $.when(collection).done(function (r1) {
            self.sleep(30000);
            self.fetchData();
          });
          this.fetchData();
        });
      },
      error: () => this.handleSnackbar("Auth failed.")
    })
  }

  getOtp() {
    let url = `https://api-${this.state.selectedRegionUrl}/apid/otp`;
    return $.ajax({
      type: "POST",
      contentType: 'text/plain',
      processData: false,
      cache: false,
      url
    });
  }


  createCollection() {
    const self = this;
    let exist = false;
    let url = `https://api-${this.state.selectedRegionUrl}/_tenant/${this.tenant}/_fabric/${this.state.fabric}/collection`;
    return $.ajax({
      type: "GET",
      contentType: 'text/plain',
      processData: false,
      cache: false,
      url,
      success: function (data) {
        let collList = data.result;
        for (let i = 0; i < collList.length; i++) {
          if ("addresses" === collList[i].name) {
            exist = true;
            console.log("Collection exists");
            break;
          }
          else {
            exist = false;
          }
        }
        if (exist === false) {
          self.collection();
        }
      }
    });

  }

  sleep(ms, resolve) {
    return new Promise(() => setTimeout(resolve, ms));
  }

  collection() {
    let url = `https://api-${this.state.selectedRegionUrl}/_tenant/${this.tenant}/_fabric/${this.state.fabric}/collection`;
    $.ajax({
      type: "POST",
      contentType: 'text/plain',
      processData: false,
      cache: false,
      url,
      data: JSON.stringify(
        {
          "name": "addresses",
        }
      ),
      success: function (data) {
        console.log("Collection Created")
      }
    });
  }

  ajaxSetup() {
    $.ajaxSetup({
      headers: {
        Authorization: `bearer ${this.jwtToken}`
      }
    });
  }

  initWebSocket() {
    this.getOtp().then(({ otp }) => {
      const { wsUrl } = this.state;
      this.connection = new WebSocket(`${wsUrl}?otp=${otp}`);

      this.connection.onmessage = this.onSocketMessageReceived;

      this.connection.onopen = () => console.log("WS connection established");

      this.connection.onerror = () => console.log("Failed to establish WS connection");

      this.connection.onclose = () => console.log("Closing WS connection");
    });
    
    this.getOtp().then(({ otp }) => {
      const { producerUrl } = this.state;
      this.producer = new WebSocket(`${producerUrl}?otp=${otp}`);

      this.producer.onopen = () => {
        setInterval(() => {
          this.producer.send(JSON.stringify({ 'payload': 'noop' }))
        }, 30000);
      }
    });

  }

  deleteData(key) {
    this.setState({ data: deleteUtil(key, this.state.data) });
  }

  addOrUpdateData(payload) {
    this.setState({ data: addOrUpdateUtil(payload, this.state.data) });
  }

  onSocketMessageReceived(message) {
    var receiveMsg = JSON.parse(message.data);
    const ackMsg = { "messageId": receiveMsg.messageId };
    this.connection.send(JSON.stringify(ackMsg));
    if (receiveMsg.payload !== 'noop') {
      const payload = JSON.parse(atob(receiveMsg.payload));
      payload._delete? this.deleteData(payload._key) : this.addOrUpdateData(payload);
    }
  }

  fetchData(isDialog) {
    var self = this;
    const { baseUrl: url } = this.state;

    this.setState({ isLoading: true }, () => {

      $.ajax({
        type: "POST",
        contentType: 'text/plain',
        processData: false,
        cache: false,
        url,
        data: JSON.stringify({
          "query": "FOR entry IN addresses RETURN entry"
        }),
        success: function (data) {
          if (!self.state.shouldShowModal) {
            self.resetModalData();
          }
          self.setState({
            isLoading: false,
            data: data.result
          });

        },
        error: function (data) {
          if (isDialog) {
            self.resetModalData();
          }
          self.setState({
            isLoading: false,
          });
          self.handleSnackbar("Could not fetch data");
          console.log('Error:', data);
        }
      });
    });
  }

  onFabPress() {
    this.setState({ shouldShowModal: true })
  }

  resetModalData() {
    this.setState({
      lastEditElem: undefined,
      shouldShowModal: false,
      isEdit: false,
      firstName: '',
      lastName: '',
      emailAddress: '',
      firstNameHasError: false,
      lastNameHasError: false,
      emailAddressHasError: false
    });
  }

  handleFormChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  validate() {
    const { firstName, lastName, emailAddress } = this.state;
    const validationObject = {};
    if (!this.state.isEdit) {
      if (!firstName.trim()) {
        validationObject.firstNameHasError = true;
      }
      if (!lastName.trim()) {
        validationObject.lastNameHasError = true;
      }
      if (!emailAddress.trim()) {
        validationObject.emailAddressHasError = true;
      }
    }
    else {
      if (!this.state.lastEditElem.email.trim()) {
        validationObject.emailAddressHasError = true;
      }
    }

    return validationObject;
  }

  onSavePressed() {

    const self = this;
    const { baseUrl: url } = this.state;

    const validationObject = this.validate();
    if (Object.keys(validationObject).length === 0) {

      let snackbarTextSuccess = 'Contact details added successfully';
      let snackbarTextFail = 'Contact details could not be added';
      const { firstName, lastName, emailAddress, isEdit } = this.state;
      let postData = `INSERT { "firstname":"${firstName}", "lastname":"${lastName}", "email":"${emailAddress}" } INTO addresses`;
      if (isEdit) {
        const { lastEditElem: { _key, firstname, lastname, email } } = this.state;
        postData = `UPDATE "${_key}" WITH { firstname:"${firstname}", lastname:"${lastname}", email:"${email}" } IN addresses`;
        snackbarTextSuccess = 'Contact details updated successfully';
        snackbarTextFail = 'Contact details could not be updated';
      }
      $.ajax({
        type: "POST",
        contentType: 'text/plain',
        processData: false,
        cache: false,
        url,
        data: JSON.stringify({ "query": postData }),
        success: function () {
          self.handleSnackbar(snackbarTextSuccess);
          self.resetModalData();
        },
        error: function (data) {
          self.handleSnackbar(snackbarTextFail);
          self.resetModalData();
          console.log('Error:', data);
        }
      });

    }
    else {
      //show error
      this.setState({ ...validationObject });
    }
  }

  onTextInputFocus(name) {
    if (this.state[`${name}HasError`]) {
      this.setState({ [`${name}HasError`]: false });
    }
  }

  onEditPressed(element) {
    if (element) {
      //show edit modal
      this.setState({ shouldShowModal: true, isEdit: true, lastEditElem: element });
    }
  }

  onRemovePressed(element) {
    const self = this;
    const { baseUrl: url } = this.state;
    if (element) {
      this.setState({ lastEditElem: element }, () => {
        $.ajax({
          type: "POST",
          contentType: 'text/plain',
          processData: false,
          cache: false,
          url,
          data: JSON.stringify({ "query": `REMOVE "${element._key}" IN addresses` }),
          success: function () {
            self.handleSnackbar("Contact details removed successfully");
            self.resetModalData();
          },
          error: function (data) {
            self.handleSnackbar("Contact details could not be removed");
            self.resetModalData();
            console.log('Error:', data);
          }
        });
      });
    }
  }

  handleSnackbar(snackbarText) {
    this.setState({ showSnackbar: true, snackbarText: snackbarText }, () => {
      setTimeout(() => {
        this.setState({ showSnackbar: false, snackbarText: '' });
      }, 2000);
    });
  };

  renderDialogContent() {
    const { firstname, lastname, email } = (this.state.lastEditElem || {});
    let dialogContent = (
      <DialogContent>
        <DialogContentText>
          {this.state.isEdit ? 'Fill in the fields to be updated.' : 'Provide all the details to add a new contact.'}
        </DialogContentText>
        <TextField
          onFocus={() => this.onTextInputFocus("firstName")}
          required={!this.state.isEdit}
          error={this.state.firstNameHasError}
          style={{ display: 'block' }}
          label="First Name"
          value={this.state.isEdit ? firstname : this.state.firstName}
          onChange={(event) => {
            if (this.state.isEdit) {
              const newLastEditElem = { ...this.state.lastEditElem };
              newLastEditElem.firstname = event.target.value;
              this.setState({ lastEditElem: newLastEditElem });
            } else {
              this.handleFormChange('firstName')(event);
            }
          }}
          margin="normal"
        />
        <TextField
          onFocus={() => this.onTextInputFocus("lastName")}
          required={!this.state.isEdit}
          error={this.state.lastNameHasError}
          style={{ display: 'block' }}
          label="Last Name"
          value={this.state.isEdit ? lastname : this.state.lastName}
          onChange={(event) => {
            if (this.state.isEdit) {
              const newLastEditElem = { ...this.state.lastEditElem };
              newLastEditElem.lastname = event.target.value;
              this.setState({ lastEditElem: newLastEditElem });
            } else {
              this.handleFormChange('lastName')(event);
            }
          }}
          margin="normal"
        />
        <TextField
          onFocus={() => this.onTextInputFocus("emailAddress")}
          required
          error={this.state.emailAddressHasError}
          style={{ display: 'block' }}
          label="Email"
          value={this.state.isEdit ? email : this.state.emailAddress}
          onChange={(event) => {
            if (this.state.isEdit) {
              const newLastEditElem = { ...this.state.lastEditElem };
              newLastEditElem.email = event.target.value;
              this.setState({ lastEditElem: newLastEditElem });
            } else {
              this.handleFormChange('emailAddress')(event);
            }
          }}
          margin="normal"
        />
      </DialogContent>
    );
    return dialogContent;
  }

  renderRegionModal() {
    const { regionModal, availableRegions, selectedRegionUrl } = this.state;
    return (
      <Dialog
        fullWidth
        open={regionModal}
      >
        <DialogTitle id="form-dialog-title">Select Region:</DialogTitle>
        <DialogContent>
          <RadioGroup
            onChange={event => {
              const selectedRegionUrl = event.target.value;
              const selectedRegionName = availableRegions.find(elem => elem.value === selectedRegionUrl).label;
              this.setState({ selectedRegionUrl, selectedRegionName })
            }
            }
            value={selectedRegionUrl}
          >
            {
              availableRegions.map(region => <FormControlLabel key={region.label} value={region.value} control={<Radio />} label={region.label} />)
            }
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!selectedRegionUrl}
            onClick={() => this.login()}
            size="small" variant="text" color="primary">
            <span className="actions">CONFIRM</span>
          </Button>
        </DialogActions>
      </Dialog>
    )
  }


  renderLoginModal() {
    let { loginModal } = this.state;
    return (
      <Dialog
        fullWidth
        open={loginModal}
      >
        <DialogTitle id="form-dialog-title">Please login to your Macrometa account:</DialogTitle>
        <DialogContent>
          <TextField
            onFocus={() => this.onTextInputFocus("email")}
            style={{ display: 'block' }}
            label="Email"
            defaultValue={this.state.email}
            onChange={(event) => {
              const email = event.target.value;
              this.setState({ email });
            }}
            margin="normal"
          />
          <TextField
            onFocus={() => this.onTextInputFocus("fabric")}
            style={{ display: 'block' }}
            label="Fabric "
            defaultValue={this.state.fabric}
            onChange={(event) => {
              const newfabric = event.target.value;
              this.setState({ fabric: newfabric });

            }}
            margin="normal"
          />

          <TextField type='password'

            onFocus={() => this.onTextInputFocus("password")}
            style={{ display: 'block' }}
            label="Password "
            defaultValue={this.state.password}
            onChange={(event) => {
              const pass = event.target.value;
              this.setState({ password: pass });

            }}
            margin="normal"
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => this.setState({
              loginModal: false,
              regionModal: true
            })}
            size="small" variant="text" color="primary">
            <span className="actions">CONFIRM</span>
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  render() {
    const { data, selectedRegionName } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={c8dbLogo} alt="logo" style={{ height: '100px' }} />
          <h1 className="App-title">Address book is connected to {selectedRegionName}</h1>
        </header>
        {this.renderLoginModal()}
        {this.renderRegionModal()}
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>KEY</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell style={{ paddingLeft: '40px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(n => {
                return (
                  <TableRow key={n._key}>
                    <TableCell component="th" scope="row">
                      {n._key}
                    </TableCell>
                    <TableCell>{n.firstname}</TableCell>
                    <TableCell>{n.lastname}</TableCell>
                    <TableCell>{n.email}</TableCell>
                    <TableCell>{
                      <div>
                        <Button
                          onClick={() => { this.onEditPressed(n) }}
                          size="small" variant="text" color="primary">
                          <span style={{ fontSize: "10px" }}>Edit</span>
                        </Button>
                        <Button
                          onClick={() => { this.onRemovePressed(n) }}
                          size="small" variant="text" color="secondary">
                          <span style={{ fontSize: "10px" }}>Remove</span>
                        </Button>
                      </div>
                    }</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
        <Fab
          onClick={this.onFabPress}
          style={{ position: 'fixed', bottom: '70px', right: '70px' }} size="large" color="primary">
          <span style={{ fontSize: "30px" }}>+</span>
        </Fab>
        {/* add new contact dialog*/}
        <Dialog
          onClose={this.resetModalData}
          open={this.state.shouldShowModal}
        >
          <DialogTitle id="form-dialog-title">{this.state.isEdit ? 'Edit contact details' : 'Add contact details'}</DialogTitle>
          {this.renderDialogContent()}
          <DialogActions>
            <Button
              onClick={() => { this.onSavePressed() }}
              size="small" variant="text" color="primary">
              <span className="actions">{this.state.isEdit ? 'UPDATE' : 'SAVE'}</span>
            </Button>
            <Button
              onClick={this.resetModalData}
              size="small" variant="text" color="secondary">
              <span className="actions">DISCARD</span>
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={this.state.showSnackbar}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.snackbarText}</span>}
        />
        {
          this.state.isLoading && <img src={spinner} alt="logo" className="spinner" />}
      </div>
    );
  }
}

export default App;

