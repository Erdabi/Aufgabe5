import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// allows using html tags as functions in javascript
const { div, button, p, h1, input, label} = hh(h);

// A combination of Tailwind classes which represent a (more or less nice) button style
const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

// Messages which can be used to update the model
const MSGS = {
  MEAL_INPUT: 'MEAL_INPUT',
  CALORIES_INPUT: 'CALORIES_INPUT',
  ADD_MEAL: 'ADD_MEAL',
  DELETE_MEAL: 'DELETE_MEAL',
  // ... ℹ️ additional messages
};

const generateMessage = (msg, data) => {
  return {
  type: msg, 
  data
  };
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  return div({ className: "flex flex-col gap-4 items-center" }, [
    h1({ className: "text-2xl" }, `Kalorienzähler`),
    label ({for: "fname"}, "foodName: " ),
    input({type: "text" ,className: "border", oninput: (event) => dispatch(generateMessage.MEAL_INPUT, event.target.value) },),
    label ({for: "fname"}, "Kalories: " ),
    input({type: "text" ,className: "border", oninput: (event) => dispatch(generateMessage.CALORIES_INPUT, event.target.value) },),
    button({ className: btnStyle, onclick: () => dispatch(MSGS.ADD_MEAL) }, "Add"),
    p({ className: "text-2xl" }, `foodName: ${model.newMenu.foodName}`),
    p({ className: "text-2xl" }, `Kalorien: ${model.newMenu.calories}`),
    p({ className: "text-2xl" }, `Total: ${model.total}`),
  ]);
}

// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
  switch (msg.type) {
    case MSGS.MEAL_INPUT:
      return { ...model.newMenu, foodName: msg.data };
    

    case MSGS.CALORIES_INPUT:
      return { ...model.newMenu, calories: msg.data };
    default:
      return model;
  }
}

// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

// The initial model when the app starts
const initModel = {
  newMenu: {
    foodName: '',
    calories: '',
  },
  meals: [{
    foodName: '',
    calories: 0
  }],
  total: 0
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);
