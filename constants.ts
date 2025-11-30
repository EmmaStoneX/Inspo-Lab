import { Inspiration, AspectRatio } from "./types";

export const ASPECT_RATIO_OPTIONS: { value: AspectRatio; label: string; icon: string }[] = [
  { value: '1:1', label: '1:1 方形', icon: '□' },
  { value: '4:3', label: '4:3 标准', icon: '▭' },
  { value: '3:4', label: '3:4 竖向', icon: '▯' },
  { value: '16:9', label: '16:9 宽屏', icon: '▭' },
  { value: '9:16', label: '9:16 竖屏', icon: '▯' },
];

export const INSPIRATIONS: Inspiration[] = [
  {
    title: "赛博朋克都市",
    prompt: "一个未来的赛博朋克城市街道，雨夜，霓虹灯在湿润的路面上反射，高耸的摩天大楼上有全息广告，电影级灯光，照片级真实感，8k分辨率。",
    thumbnail: "https://image.pollinations.ai/prompt/cyberpunk%20city%20street%20night%20rain%20neon%20reflections%208k%20photorealistic?width=800&height=600&nologo=true"
  },
  {
    title: "梦幻魔法森林",
    prompt: "一个异想天开的魔法森林，发光的蘑菇，萤火虫，飘渺的雾气，古老的苔藓树，柔和的阳光透过树叶过滤，奇幻艺术风格，细节丰富。",
    thumbnail: "https://image.pollinations.ai/prompt/magical%20forest%20glowing%20mushrooms%20fireflies%20mist%20fantasy%20art?width=800&height=600&nologo=true"
  },
  {
    title: "极简花卉肖像",
    prompt: "一幅由花朵组成的女性极简主义肖像，柔和的色彩，柔和的工作室灯光，白色背景，高级时尚摄影风格。",
    thumbnail: "https://image.pollinations.ai/prompt/minimalist%20portrait%20woman%20made%20of%20flowers%20soft%20lighting?width=800&height=600&nologo=true"
  },
  {
    title: "等距游戏房间",
    prompt: "温馨游戏玩家房间的等距视图，低多边形3D渲染，柔和的粉彩灯光，详细的电脑设置，植物，懒人沙发，粘土渲染风格，盲盒公仔质感。",
    thumbnail: "https://image.pollinations.ai/prompt/isometric%20gamer%20room%20cute%20pastel%20low%20poly%203d%20render?width=800&height=600&nologo=true"
  },
  {
    title: "太空喵星人",
    prompt: "一只可爱的猫咪宇航员漂浮在深太空中，银河背景，星云，星星，头盔面罩上的反射，高度详细的数字艺术，皮克斯风格。",
    thumbnail: "https://image.pollinations.ai/prompt/cute%20cat%20astronaut%20in%20space%20galaxy%20pixar%20style?width=800&height=600&nologo=true"
  },
  {
    title: "金色折纸龙",
    prompt: "一只由金纸制成的精致折纸龙，戏剧性的灯光，黑色背景，微距摄影，景深效果，无论是折痕还是质感都极其逼真。",
    thumbnail: "https://image.pollinations.ai/prompt/gold%20origami%20dragon%20black%20background%20dramatic%20lighting?width=800&height=600&nologo=true"
  }
];
