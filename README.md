#react-tagcloud

Simple tag/word cloud React component.

![preview tag-cloud preview](http://s27.postimg.org/ki0u7pe83/preview.png)

### Installation

```
npm install react-tagcloud
```

### Usage

#### Simple cloud with onClick handler

```javascript
import { TagCloud, defaultRenderer } from "react-tagcloud";

const data = [
  { value: "jQuery", count: 25 }, { value: "MongoDB", count: 18 },
  { value: "JavaScript", count: 38 }, { value: "React", count: 30 },
  { value: "Nodejs", count: 28 }, { value: "Express.js", count: 25 },
  { value: "HTML5", count: 33 }, { value: "CSS3", count: 20 }
];

const SimpleCloud = () => (
  <TagCloud minSize={12}
            maxSize={35}
            tags={data}
            onClick={tag => console.log('clicking on tag:', tag)} />
);
```

#### Custom color options and custom props

```javascript
const renderer = defaultRenderer({
  props: {
    style: { border: '1px solid silver', padding: '5px' },
    className: 'my-tag-class'
  },
  colorOptions: {
    luminosity: 'light',
    hue: 'blue'
  }
});

const CustomOptionsCloud = () => (
  <TagCloud minSize={12}
            maxSize={35}
            tags={data}
            renderer={renderer} />
);
```

#### Custom renderer

```javascript
const customRenderer = (tag, size, key) => {
  return <span key={key} className={`tag-${size}`}>{tag.value}</span>;
};

const CustomRendererCloud = () => (
  <TagCloud tags={data}
            minSize={1}
            maxSize={5}
            renderer={customRenderer} />
);
```

* Color of tags is computed with [randomColor](https://github.com/davidmerfield/randomColor).
* See more in [./examples](https://github.com/madox2/react-tagcloud/tree/master/examples)

## License

[MIT License](https://github.com/madox2/react-tagcloud/blob/master/LICENSE)

