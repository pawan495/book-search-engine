import React from "react";
import {
   Jumbotron,
   Container,
   CardColumns,
   Card,
   Button,
} from "react-bootstrap";

import { removeBookId } from "../utils/localStorage";

// graphql
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
   // graphql
   // rename "data" from useQuery to userData
   const { loading, data: userData } = useQuery(QUERY_ME);
   const [removeBook] = useMutation(REMOVE_BOOK);

   // create method to remove saved book
   const handleRemoveBook = async (bookId) => {
      try {
         // remove book
         await removeBook({
            variables: { bookId },
         });

         // upon success, remove book's id from localStorage
         removeBookId(bookId);
      } catch (err) {
         console.error(err);
      }
   };
   console.log(userData);

   return (
      <>
         {/* if data isn't loaded yet, say so */}
         {/* else if not logged in, say so */}
         {/* else display data */}
         {loading ? (
            <h2>Loading...</h2>
         ) : !userData ? (
            <h2>You must be logged in to view your saved books!</h2>
         ) : (
            <>
               {/* display components when finished loading */}
               <Jumbotron fluid className="text-light bg-dark">
                  <Container>
                     <h1>Viewing saved books!</h1>
                  </Container>
               </Jumbotron>
               <Container>
                  {/* remember that object is contained in userData.me */}
                  <h2>
                     {userData.me.savedBooks.length
                        ? `Viewing ${userData.me.savedBooks.length} saved ${
                             userData.me.savedBooks.length === 1
                                ? "book"
                                : "books"
                          }:`
                        : "You have no saved books!"}
                  </h2>
                  <CardColumns>
                     {userData.me.savedBooks.map((book, i) => {
                        return (
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
                                 <p className="small">
                                    Authors: {book.authors}
                                 </p>
                                 <Card.Text>{book.description}</Card.Text>
                                 <Button
                                    className="btn-block btn-danger"
                                    onClick={() =>
                                       handleRemoveBook(book.bookId)
                                    }
                                 >
                                    Delete this Book!
                                 </Button>
                              </Card.Body>
                           </Card>
                        );
                     })}
                  </CardColumns>
               </Container>
            </>
         )}
      </>
   );
};

export default SavedBooks;
