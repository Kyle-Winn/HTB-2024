import {
  ChakraProvider,
  HStack,
  theme,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { Movie } from "./util/util"
import { SwipePage } from "./pages/SwipePage"
import { SessionPage } from "./pages/SessionPage"

export const App = () => {

  const users = 2;
  const [sessionId, setSessionId] = useState('');
  const [userId, setUserId] = useState('');
  const [movies, setMovies] = useState([] as Movie[]);
  const [started, start] = useState(false);

  console.log(sessionId);
  console.log(userId);
  console.log(movies);

  return (
    <ChakraProvider theme={theme}>
      <HStack w='100vw' display='flex' h='100vh' justifyContent='center'>
        <VStack>
          {started ? <SwipePage sessionId={sessionId} movies={movies} userId={userId} /> :
            <SessionPage sessionId={sessionId} userId={userId} movies={movies} setMovies={setMovies} setUserId={setUserId} setSessionId={setSessionId} start={() => start(true)} />
          }
        </VStack>
      </HStack>
    </ChakraProvider>)
}
