import React, { useState, useEffect } from "react";
import { API, input } from "aws-amplify";
import { Link } from "react-router-dom";
import { BsFillCaretRightFill, BsPencilSquare, BsSearch } from "react-icons/bs";
import ListGroup from "react-bootstrap/ListGroup";
import { LinkContainer } from "react-router-bootstrap";
import { Form, Container, Row, InputGroup } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [filterString, setFilterString] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [replacementText, setReplacementText] = useState("");
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadNotes() {
    return API.get("notes", "/notes");
  }

  async function replaceNoteText(note) {
    let newContent = {
      body: {
        content: note.content.replace(originalText, replacementText),
      },
    };
    return API.put("notes", "/notes/" + note.noteId, newContent);
  }

  function replaceAllNoteText() {
    setIsLoading(true);
    console.log("isLoading: " + isLoading);
    let updatePromises = notes.map(replaceNoteText);
    Promise.all(updatePromises)
      .then(() => {
        loadNotes().then((notes) => setNotes(notes));
      })
      .then(() => {
        setIsLoading(false);
      });
    //await loadNotes();
    console.log("isLoading: " + isLoading);
  }

  function renderNotesList(notes) {
    return (
      <>
        <div>
          <span>
            <BsSearch size={17} />
            <input
              type="text"
              value={filterString}
              onChange={(e) => setFilterString(e.target.value)}
            />
          </span>
        </div>
        <LinkContainer to="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new note</span>
          </ListGroup.Item>
        </LinkContainer>
        {notes
          .filter((note) => note.content.includes(filterString))
          .map(({ noteId, content, createdAt }) => (
            <LinkContainer key={noteId} to={`/notes/${noteId}`}>
              <ListGroup.Item action>
                <span className="font-weight-bold">
                  {content.trim().split("\n")[0]}
                </span>
                <br />
                <span className="text-muted">
                  Created: {new Date(createdAt).toLocaleString()}
                </span>
              </ListGroup.Item>
            </LinkContainer>
          ))}
      </>
    );
  }

  function renderReplaceTextControls() {
    return (
      <>
        <div>
          <Container fluid="md">
            <Row>
              <h3 className="pb-3 mt-4 mb-3 border-bottom">
                Replace text in all notes
              </h3>
            </Row>
            <Row>
              <InputGroup className="mb-3">
                <Form.Control
                  size="sm"
                  placeholder="Find"
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                />{" "}
                <InputGroup.Text>with</InputGroup.Text>
                <Form.Control
                  size="sm"
                  placeholder="Replace"
                  value={replacementText}
                  onChange={(e) => setReplacementText(e.target.value)}
                />
                <LoaderButton
                  size="sm"
                  variant="primary"
                  onClick={!isLoading ? replaceAllNoteText : null}
                  isLoading={isLoading}
                  disabled={
                    isLoading && (originalText === "" || replacementText === "")
                  }
                >
                  {isLoading ? "Loading" : "Replace"}
                  <BsFillCaretRightFill />
                </LoaderButton>
              </InputGroup>
            </Row>
          </Container>
        </div>
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p className="text-muted">A simple note taking app</p>
        <div className="pt-3">
          <Link to="/login" className="btn btn-info btn-lg mr-3">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
        {renderReplaceTextControls()}
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
