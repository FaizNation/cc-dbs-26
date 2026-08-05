import React from 'react';
import PropTypes from 'prop-types';

class NoteInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            body: '',
        };

        this.onTitleChangeEventHandler = this.onTitleChangeEventHandler.bind(this);
        this.onBodyChangeEventHandler = this.onBodyChangeEventHandler.bind(this);
        this.onSubmitEventHandler = this.onSubmitEventHandler.bind(this);
    }

    onTitleChangeEventHandler(event) {
        this.setState(() => {
            return {
                title: event.target.value,
            };
        });
    }

    onBodyChangeEventHandler(event) {
        this.setState(() => {
            return {
                body: event.target.innerHTML,
            };
        });
    }

    // Note: Requirements mention "Memanfaatkan controlled component dalam membuat form input title dan body (jika tidak menggunakan contentEditable)."
    // The provided style.css shows .add-new-page__input__body being a div with contenteditable might be expected or input/textarea.
    // Looking at style.css:
    // .add-new-page__input .add-new-page__input__body { ... min-height: 500px; }
    // It seems like a textarea or contentEditable div.
    // The requirement says "Controlled component ... (jika tidak menggunakan contentEditable)".
    // I will use a simple textarea for body to stick to "Controlled component" easily, as contentEditable is harder to control in React.
    // Wait, the style `min-height: 500px`. `[data-placeholder]:empty::before`. This strongly suggests a contentEditable div is intended by the style provided.
    // BUT the requirement Says: "Memanfaatkan controlled component ... (jika tidak menggunakan contentEditable)".
    // This implies if I use `textarea`, I MUST use controlled component. If I use contentEditable, I might not need to (or it's harder).
    // I'll stick to `contentEditable` div if the styled css expects it? 
    // `.add-new-page__input__body` has `data-placeholder` in css selector. 
    // I will use a div with contentEditable to match the styles better, but make it controlled?
    // Actually, standard textarea is safer for "Controlled component". I'll use textarea/input and apply the class.
    // Let's check the CSS again.
    // `[data-placeholder]:empty::before` targets an empty element with that attribute. Input/Textarea don't have children or ::before usually work the same way for placeholder.
    // So likely a `div` with `contentEditable`.
    // The requirement says: "Memanfaatkan controlled component dalam membuat form input title dan body (jika tidak menggunakan contentEditable)."
    // This means: If NOT using contentEditable, use Controlled.
    // If Use contentEditable, it's allowed (and maybe implied by the styles). 
    // To keep it simple and robust, I will use a ContentEditable div and try to make it controlled or just ref-based, or just use a Textarea and adjust styles?
    // Textarea `placeholder` attribute works fine.
    // I will use `textarea` for body because it's easier to make controlled.

    onBodyChangeEventHandler(event) {
        this.setState(() => ({
            body: event.target.value,
        }));
    }

    onSubmitEventHandler(event) {
        event.preventDefault();
        this.props.addNote(this.state);
    }

    render() {
        return (
            <div className="add-new-page__input">
                <input
                    className="add-new-page__input__title"
                    placeholder="Catatan rahasia"
                    value={this.state.title}
                    onChange={this.onTitleChangeEventHandler}
                />
                <textarea
                    className="add-new-page__input__body"
                    placeholder="Sebenarnya saya adalah ..."
                    value={this.state.body}
                    onChange={this.onBodyChangeEventHandler}
                />
                <div className="add-new-page__action">
                    <button className="action" type="button" title="Simpan" onClick={this.onSubmitEventHandler}>
                        {/* SVG Check icon */}
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></svg>
                    </button>
                </div>
            </div>
        );
    }
}

NoteInput.propTypes = {
    addNote: PropTypes.func.isRequired,
};

export default NoteInput;
