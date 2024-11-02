import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const AddEmoji = ({ onSelectEmoji }) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleEmojiClick = (emojiObject) => {
        onSelectEmoji(emojiObject.emoji || emojiObject);
        setShowPicker(false);
    };

    return (
        <div className="emoji-picker-container">
            <button onClick={() => setShowPicker((prev) => !prev)}>😄</button>
            {showPicker && (
                <div className="emoji-picker">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
            )}
        </div>
    );
};

export default AddEmoji;
