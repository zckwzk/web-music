import logo from "./logo.svg";
import "./App.css";

console.log("test");

function App() {
  return (
    <div className="App">
      <header className="App-header">
        console.log("🚀 ~ file: App.js:8 ~ App ~ header", header)
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload add test.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
