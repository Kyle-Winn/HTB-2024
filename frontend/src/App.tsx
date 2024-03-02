import * as React from "react"
import {
  ChakraProvider,
  HStack,
  theme,
  VStack,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"
import { SwipeableCard } from "./components/SwipeableCard"
import { SwipePage } from "./pages/SwipePage"
import { SessionPage } from "./pages/SessionPage"

export const App = () => (
  <ChakraProvider theme={theme}>
    <HStack w='100vw' display='flex' h='100vh'justifyContent='center'>
      <VStack>
        {/* <SwipePage sessionId="1234"/> */}
        <SessionPage />
      </VStack>
    </HStack>
  </ChakraProvider>
)
