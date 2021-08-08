# react-async-generators

Use async generators as if they were components. Supports wrapping functional components,
async components, generator components, and async generator components.

## Usage

Basic usage is to use the asyncGen wrapper function to handle the async generator
within the React lifecycle.

```jsx
import { asyncGen } from 'react-async-generators';

async function* MyComponent({ id }) {
    yield <div>Loading</div>;

    try {
        const { name } = await getUser(id);

        yield <div>Name: {name}</div>;
    } catch (e) {
        yield <div>Error:{e.message}</div>
    }
}

export default asyncGen(MyComponent);
```

You can wrap something just async functions too:

```jsx
async function MyPromise({ id }) {
    const { name } = await getUser(id);

    return <div>Name: {name}</div>
}

export default asyncGen(MyPromise);
```

There is also a component form of the functional wrapper, which can be useful
if you don't want to wrap every export with the `asyncGen` function:

```jsx
import { AsyncGenerator } from 'react-async-generators';

const App = () => (
    <AsyncGenerator render={MyComponent} id={1} />
);
```

## Examples

There are a set of examples showing different types of components in the `./examples` folder
using a create-react-app application.

## Drawbacks

* Still looking into how you would blend async generators and hooks together
* Related to the above point, you only get one lifecycle method to work with: `refresh`.
* ~~Currently doesn't handle refs~~ (Handle refs by using `React.ref()`).

## FAQ

**Question: My component isn't re-rendering when the props change!**

Answer: If your props are equal due to a `fast-deep-equal` check, then the component
will not update with new props. This commonly happens when you mutate an object
instead of treating objects as immutable.
