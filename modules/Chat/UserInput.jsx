import React, { Component } from 'react';
import SendIcon from './icons/SendIcon';
import EmojiIcon from './icons/EmojiIcon';
import PopupWindow from './PopupWindow';
import EmojiPicker from './emoji-picker/EmojiPicker';

class UserInput extends Component {
  constructor() {
    super();
    this.state = {
      inputActive: false,
      message: '',
      emojiPickerIsOpen: false,
      emojiFilter: '',
    };
  }

  componentDidMount() {
    this.emojiPickerButton = document.getElementById('sc-emoji-picker-button');
  }

  handleKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      return this.submitText(event);
    }
  };

  toggleEmojiPicker = (e) => {
    e.preventDefault();
    if (!this.state.emojiPickerIsOpen) {
      this.setState({ emojiPickerIsOpen: true });
    }
  };

  closeEmojiPicker = (e) => {
    if (this.emojiPickerButton.contains(e.target)) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.setState({ emojiPickerIsOpen: false });
  };

  submitText = (event) => {
    event.preventDefault();
    const text = this.userInput.textContent;
    if (text && text.length > 0) {
      this.props.onSubmit({
        message: text,
      });
      this.userInput.innerHTML = '';
    }
  };

  handleEmojiPicked = (emoji) => {
    this.setState({ emojiPickerIsOpen: false });
    const text = this.userInput.textContent;
    if (text) {
      this.userInput.innerHTML += emoji;
    } else {
      this.props.onSubmit({
        type: 'emoji',
        message: emoji,
      });
    }
  };

  handleEmojiFilterChange = (event) => {
    const emojiFilter = event.target.value;
    this.setState({ emojiFilter });
  };

  render() {
    const { emojiPickerIsOpen, inputActive } = this.state;
    return (
      <form className={`sc-user-input ${inputActive ? 'active' : ''}`}>
        <div
          role="button"
          tabIndex="1"
          onFocus={() => {
            this.setState({ inputActive: true });
          }}
          onBlur={() => {
            this.setState({ inputActive: false });
          }}
          ref={(e) => {
            this.userInput = e;
          }}
          onKeyDown={this.handleKeyDown}
          contentEditable="true"
          aria-multiline="true"
          aria-label="message-body"
          placeholder="Write a reply..."
          className="sc-user-input--text"
        />
        <div className="sc-user-input--buttons">
          <div className="sc-user-input--button" />
          <div className="sc-user-input--button">
            {this.props.showEmoji && (
              <EmojiIcon
                onClick={this.toggleEmojiPicker}
                isActive={emojiPickerIsOpen}
                tooltip={
                  <PopupWindow
                    isOpen={this.state.emojiPickerIsOpen}
                    onClickedOutside={this.closeEmojiPicker}
                    onInputChange={this.handleEmojiFilterChange}
                  >
                    <EmojiPicker onEmojiPicked={this.handleEmojiPicked} filter={this.state.emojiFilter} />
                  </PopupWindow>
                }
              />
            )}
          </div>
          <div className="sc-user-input--button">
            <SendIcon onClick={this.submitText} />
          </div>
        </div>
      </form>
    );
  }
}

export default UserInput;
