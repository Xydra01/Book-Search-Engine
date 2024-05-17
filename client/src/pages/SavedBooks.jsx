import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client'; // Import useQuery and useMutation hooks
import { GET_ME } from '../utils/queries'; // Import GET_ME and REMOVE_BOOK queries
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  // Use useQuery hook to execute GET_ME query
  const { loading, error, data } = useQuery(GET_ME);

  // Define useMutation hook for REMOVE_BOOK mutation
  const [removeBookMutation] = useMutation(REMOVE_BOOK, {
    onError: (error) => {
      console.error(error);
    },
  });

  // Define useEffect to update userData when data changes
  useEffect(() => {
    if (data) {
      setUserData(data.me);
    }
  }, [data]);

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Execute REMOVE_BOOK mutation
      const { data } = await removeBookMutation({
        variables: { bookId },
      });

      // Update userData with the updated user data
      setUserData(data.removeBook);

      // Remove book ID from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  if (error) {
    console.error(error);
    return <h2>Error occurred while loading data</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
