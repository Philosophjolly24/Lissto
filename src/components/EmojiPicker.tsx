import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface EmojiPickProps {
  width: number;
  height: number;
  searchPlaceholder: string;
  lazyLoadEmojis?: boolean;
  autoFocusSearch?: boolean;
  onEmojiClick?: (emojiData: EmojiClickData, event: MouseEvent) => void;
}
export default function EmojiPick({
  width,
  height,
  searchPlaceholder,
  lazyLoadEmojis,
  autoFocusSearch,
  onEmojiClick,
}: EmojiPickProps) {
  return (
    <div className="emoji-picker-section">
      <EmojiPicker
        width={width}
        height={height}
        searchPlaceholder={searchPlaceholder}
        lazyLoadEmojis={lazyLoadEmojis}
        autoFocusSearch={autoFocusSearch}
        onEmojiClick={onEmojiClick}
      />
    </div>
  );
}
