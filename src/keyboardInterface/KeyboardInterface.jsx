import { Input, TextField } from '@mui/material';
import React, { Component } from 'react';
import PropTypes, { string } from 'prop-types';

export default class KeyboardInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props?.value || "",
      previousText: "",
      newText: "",
      outOfScopeText: this.props?.value || "",
    };

    // refs
    const utilizeFocus = () => {
      const ref = React.createRef()
      const setFocus = () => { ref.current && ref.current.focus() }
      return { setFocus, ref }
    }
    this.inputRef = utilizeFocus();

    // handlers
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    this.handleInputReset = this.handleInputReset.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.setText = this.setText.bind(this);
  }

  componentDidMount() {
    this.handleInputFocus();
  }

  handleInputKeyDown(event, enterKeyHandler) {
    let keyCode = event.keyCode ? event.keyCode : event.which;

    // trigger enter if handler available
    if (keyCode === 13) {
      if (enterKeyHandler !== null && enterKeyHandler !== undefined) {
        enterKeyHandler();
        this.handleInputReset();
      }
    }
  }

  setText(text) {
    this.setState({
      text,
    });
  }

  handleInputChange(event, inputChangeHandler) {
    this.setState({
      text: event.target.value,
    }, () => {
      if (inputChangeHandler !== null && inputChangeHandler !== undefined) {
        inputChangeHandler(event);
      }
    });
  }

  handleInputReset() {
    this.setState({
      text: "",
      previousText: "",
      newText: "",
      outOfScopeText: "",
    });

  }

  handleInputFocus() {
    this.inputRef.setFocus();
  }

  render() {
    return (
      this.props.interface === "textfield" ?
        (
          <TextField
            id={this.props.id}
            name={this.props.name}
            type={this.props.type}
            inputProps={this.props.inputProps}
            margin={this.props.margin}
            className={" " + this.props.className}
            hiddenLabel={this.props.hiddenLabel}
            label={this.props.label}
            size={this.props.size}
            variant={this.props.variant}
            autoFocus={this.props.autoFocus}
            inputRef={this.inputRef.ref}
            error={this.props.error}
            helperText={this.props.helperText}
            value={this.state.text}
            defaultValue={this.props.defaultValue}
            placeholder={this.props.placeholder}
            onChange={(e) => { this.handleInputChange(e, this.props?.handleChange || null) }}
            onKeyDown={(e) => { this.handleInputKeyDown(e, this.props?.handleEnter || null, this.props?.handleShortcut || null) }}
            disabled={this.props.disabled}
            required={this.props.required}
            fullWidth={this.props.fullWidth} />
        )
        :
        (
          <Input
            id={this.props.id}
            name={this.props.name}
            type={this.props.type}
            inputProps={this.props.inputProps}
            margin={this.props.margin}
            placeholder={this.props?.placeholder || "Type a message here..."}
            className={" " + this.props.className}
            color={this.props.color || "secondary"}
            size={this.props.size}
            disableUnderline={this.props.disableUnderline || false}
            inputRef={this.inputRef.ref}
            error={this.props.error}
            autoFocus={this.props.autoFocus}
            value={this.state.text}
            defaultValue={this.props.defaultValue}
            onChange={(e) => { this.handleInputChange(e, this.props?.handleChange || null) }}
            onKeyDown={(e) => { this.handleInputKeyDown(e, this.props?.handleEnter || null) }}
            disabled={this.props.disabled}
            required={this.props.required}
            fullWidth={this.props.fullWidth} />
        )
    );
  }
}

KeyboardInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.oneOf(["filled", "outlined", "standard"]),
  inputProps: PropTypes.object,
  required: PropTypes.bool,
  margin: PropTypes.oneOf(["none", "dense", "normal"]),
  interface: PropTypes.oneOf(["input", "textfield"]).isRequired,
  value: PropTypes.string,
  defaultValue: PropTypes.any,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  autoFocus: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium"]),
  color: PropTypes.oneOf(["primary", "secondary", string]),
  label: PropTypes.node,
  hiddenLabel: PropTypes.bool,
  disableUnderline: PropTypes.bool,
  handleChange: PropTypes.func,
  handleTextChange: PropTypes.func,
  handleEnter: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

KeyboardInput.defaultProps = {
  id: undefined,
  name: undefined,
  type: undefined,
  variant: "filled",
  inputProps: {},
  margin: "none",
  required: false,
  interface: "input",
  value: "",
  defaultValue: undefined,
  placeholder: "Type here...",
  className: "w-100",
  autoFocus: true,
  size: "small",
  color: "primary",
  label: undefined,
  hiddenLabel: true,
  disableUnderline: true,
  handleChange: undefined,
  handleTextChange: undefined,
  handleEnter: undefined,
  error: false,
  helperText: "",
  disabled: false,
  fullWidth: false,
};
