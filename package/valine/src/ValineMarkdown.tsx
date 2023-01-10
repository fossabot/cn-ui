import { Markdown } from '@cn-ui/markdown';
import { Component, For } from 'solid-js';
import { emojiPlugin } from './emoji';

export const PreferEmojiMap = {
    'no way': '😂',
    tear: '😭',
    haha: '😄',
    greddy: '😘',
    grinning: '😀',
    smiley: '😃',
    grin: '😁',
    sweat_smile: '😅',
    blush: '😊',
    innocent: '😇',
    wink: '😉',
    relieved: '😌',
    heart_eyes: '😍',
    kissing: '😗',
    kissing_smiling_eyes: '😙',
    kissing_closed_eyes: '😚',
    yum: '😋',
    stuck_out_tongue_winking_eye: '😜',
    stuck_out_tongue_closed_eyes: '😝',
    stuck_out_tongue: '😛',
    sunglasses: '😎',
    smirk: '😏',
    unamused: '😒',
    disappointed: '😞',
    pensive: '😔',
    worried: '😟',
    confused: '😕',
    persevere: '😣',
    confounded: '😖',
    tired_face: '😫',
    weary: '😩',
    angry: '😠',
    rage: '😡',
    no_mouth: '😶',
    neutral_face: '😐',
    expressionless: '😑',
    hushed: '😯',
    frowning: '😦',
    anguished: '😧',
    open_mouth: '😮',
    astonished: '😲',
    dizzy_face: '😵',
    flushed: '😳',
    scream: '😱',
    fearful: '😨',
    cold_sweat: '😰',
    cry: '😢',
    disappointed_relieved: '😥',
    sweat: '😓',
    sleepy: '😪',
    sleeping: '😴',
    mask: '😷',
    smiling_imp: '😈',
    smiley_cat: '😺',
    smile_cat: '😸',
    joy_cat: '😹',
    heart_eyes_cat: '😻',
    smirk_cat: '😼',
    kissing_cat: '😽',
    scream_cat: '🙀',
    crying_cat_face: '😿',
    pouting_cat: '😾',
    cat: '🐱',
    mouse: '🐭',
    cow: '🐮',
    monkey_face: '🐵',
    hand: '✋',
    fist: '✊',
    v: '✌️',
    point_up: '👆',
    point_down: '👇',
    point_left: '👈',
    point_right: '👉',
    facepunch: '👊',
    wave: '👋',
    clap: '👏',
    open_hands: '👐',
    '+1': '👍',
    '-1': '👎',
    ok_hand: '👌',
    pray: '🙏',
    ear: '👂',
    eyes: '👀',
    nose: '👃',
    lips: '👄',
    tongue: '👅',
    heart: '❤️',
    cupid: '💘',
    sparkling_heart: '💖',
    star: '⭐️',
    sparkles: '✨',
    zap: '⚡️',
    sunny: '☀️',
    cloud: '☁️',
    snowflake: '❄️',
    umbrella: '☔️',
    coffee: '☕️',
    airplane: '✈️',
    anchor: '⚓️',
    watch: '⌚️',
    phone: '☎️',
    hourglass: '⌛️',
    email: '✉️',
    scissors: '✂️',
    black_nib: '✒️',
    pencil2: '✏️',
    x: '❌',
    recycle: '♻️',
    white_check_mark: '✅',
    negative_squared_cross_mark: '❎',
    m: 'Ⓜ️',
    i: 'ℹ️',
    tm: '™️',
    copyright: '©️',
    registered: '®️',
};
export const EmojiList: Component<{ onChoose: (emojiText: string) => void }> = (props) => {
    return (
        <For each={Object.entries(PreferEmojiMap)}>
            {([text, emoji]) => {
                return (
                    <span
                        class="w-fit scale-125 hover:scale-150 hover:-translate-y-4 transition-transform cursor-pointer"
                        title={text}
                        onclick={() => props.onChoose(text)}
                    >
                        {emoji}
                    </span>
                );
            }}
        </For>
    );
};

export const ValineMarkdown: Component<{ code: string }> = (props) => {
    return (
        <Markdown
            code={props.code}
            remarkPlugins={[() => emojiPlugin({ emojiMap: PreferEmojiMap })]}
        ></Markdown>
    );
};
