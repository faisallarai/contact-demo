import React, { useState } from "react";

const Notification = ({ errorMessage }) => <p>{errorMessage}</p>;

const LoginForm = ({
  handleLogin,
  handleUsername,
  handlePassword,
  username,
  password
}) => {
  return (
    <form onSubmit={handleLogin}>
      Username:
      <input type="text" value={username} onChange={handleUsername} />
      Password:
      <input type="text" value={password} onChange={handlePassword} />
      <button type="submit">Login</button>
    </form>
  );
};

const NoteForm = ({
  handleNote,
  handleContact,
  handleImportant,
  contact,
  important
}) => {
  return (
    <form onSubmit={handleNote}>
      Contact:
      <input type="text" value={contact} onChange={handleContact} />
      Important:
      <input type="checkbox" checked={important} onChange={handleImportant} />
      <button type="submit">Save</button>
    </form>
  );
};

const NoteHeader = ({
  handleShowImportant,
  handleSearch,
  search,
  showImportant
}) => {
  return (
    <div>
      Show Important
      <input
        type="checkbox"
        checked={showImportant}
        onChange={handleShowImportant}
      />
      Search
      <input type="text" value={search} onChange={handleSearch} />
    </div>
  );
};

const NoteDetail = ({ notes }) => {
  const noteToShow = notes.map(note => {
    return (
      <form>
        <label>Contact:</label>
        <input type="text" value={note.contact} />
        <label>Important:</label>
        <input type="checkbox" checked={note.important} />
      </form>
    );
  });

  return (
    <div>
      <h1>Note Detail</h1>
      {noteToShow}
    </div>
  );
};

const NoteList = ({
  notes,
  setNotes,
  handleSearch,
  handleShowImportant,
  search,
  showImportant
}) => {
  const notesFiltered = showImportant
    ? notes.filter(note => note.important === showImportant)
    : notes;

  const notesToShow =
    search === ""
      ? notesFiltered
      : notesFiltered.filter(note =>
          note.contact.toLowerCase().includes(search.toLowerCase())
        );

  const rows = notesToShow.map((note, index) => {
    const handleToggle = contact => {
      const note = notes.find(note => note.contact === contact);
      const existingNote = { ...note, important: !note.important };
      setNotes(
        notes.map(note =>
          note.contact === existingNote.contact ? existingNote : note
        )
      );
    };

    return (
      <li key={index}>
        {note.contact} |
        <input
          type="checkbox"
          checked={note.important}
          onChange={() => handleToggle(note.contact)}
        />
      </li>
    );
  });

  return (
    <div>
      <NoteHeader
        handleSearch={handleSearch}
        handleShowImportant={handleShowImportant}
        search={search}
        showImportant={showImportant}
      />
      {notesToShow.length === 1 ? (
        <NoteDetail notes={notesToShow} />
      ) : (
        <ul>{rows}</ul>
      )}
    </div>
  );
};

const Togglable = props => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const handleClick = () => {
    setVisible(!visible);
  };

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={handleClick}>{props.label}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={handleClick}>Cancel</button>
      </div>
    </div>
  );
};

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState([]);
  const [important, setImportant] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showImportant, setShowImportant] = useState(false);
  const [search, setSearch] = useState("");

  const handleUsername = event => {
    setUsername(event.target.value);
  };

  const handlePassword = event => {
    setPassword(event.target.value);
  };

  const handleLogin = event => {
    event.preventDefault();
    if (username === "admin" && password === "admin") {
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
      setErrorMessage("");
    } else {
      setErrorMessage("Wrong Credentials");
    }
  };

  const loginForm = () => {
    return (
      <Togglable label="login">
        <LoginForm
          handleLogin={handleLogin}
          handleUsername={handleUsername}
          handlePassword={handlePassword}
          username={username}
          password={password}
        />
      </Togglable>
    );
  };

  const handleContact = event => {
    setContact(event.target.value);
  };

  const handleImportant = event => {
    setImportant(event.target.checked);
  };

  const handleNote = event => {
    event.preventDefault();
    console.log(contact);
    console.log("in note", important);
    if (contact === "") {
      setErrorMessage("Contact cannot be blank");
    } else {
      const newNote = {
        contact,
        important
      };
      console.log("newNote", newNote);
      setNotes(notes.concat(newNote));
      setContact("");
      setErrorMessage("");
      setImportant(false);
    }
  };

  const notePage = () => {
    return (
      <div>
        {noteForm()}
        {noteList()}
      </div>
    );
  };

  const handleSearch = event => {
    setSearch(event.target.value);
  };

  const handleShowImportant = event => {
    setShowImportant(event.target.checked);
  };

  const noteList = () => {
    return (
      <NoteList
        notes={notes}
        search={search}
        setNotes={setNotes}
        handleSearch={handleSearch}
        handleShowImportant={handleShowImportant}
        showImportant={showImportant}
      />
    );
  };

  const noteForm = () => {
    return (
      <Togglable label="new form">
        <NoteForm
          handleNote={handleNote}
          handleContact={handleContact}
          handleImportant={handleImportant}
          contact={contact}
          important={important}
        />
      </Togglable>
    );
  };

  return (
    <div>
      <p>Demo</p>
      <Notification errorMessage={errorMessage} />
      {isLoggedIn ? notePage() : loginForm()}
    </div>
  );
};

export default App;
