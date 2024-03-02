import React, { useState, useCallback } from 'react';
import {
  Box,
  Badge,
  Center,
  Text,
  Flex,
  Button,
  Circle,
  Icon
} from '@chakra-ui/react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Card, Direction, Movie } from '../util/util';
import { FaStar } from "react-icons/fa";
import { IoIosHeart } from "react-icons/io";
import { MdClose } from "react-icons/md";

export const SwipeableCard: React.FC<{ movie: Movie, onSwipe: (direction: Direction) => void, style?: React.CSSProperties }> = (
  { movie, onSwipe, style }
) => {
  const [isRight, setIsRight] = useState(false);
  const [isLeft, setIsLeft] = useState(false);
  const [x, setX] = useState(0);

  const motionX = useMotionValue(x);
  const opacity = useTransform(motionX, [-100, 0, 100], [0, 1, 0]);

  const sensitivity = {
    x: 50,
    v: 1000,
    d: (v: number, sv: number) => v / sv * 20,
  };

  const handleSwipeRight = useCallback((velocity: number) => {
    setIsRight(true);
    setX(100);
    setTimeout(() => {
      setIsRight(false);
      setX(0);
      onSwipe(Direction.RIGHT); // Trigger callback for right swipe
    }, sensitivity.d(velocity, sensitivity.v));
  }, [onSwipe]);

  const handleSwipeLeft = useCallback((velocity: number) => {
    setIsLeft(true);
    setX(-100);
    setTimeout(() => {
      setIsLeft(false);
      setX(0);
      onSwipe(Direction.LEFT); // Trigger callback for left swipe
    }, sensitivity.d(velocity, sensitivity.v));
  }, [onSwipe]);

  return (
    <Box
      key={movie.title}
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      style={style}
    >
      <motion.div
        style={{ x: motionX, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = offset.x > sensitivity.x || velocity.x > sensitivity.v;
          if (swipe) {
            handleSwipeRight(velocity.x);
          } else if (offset.x < -sensitivity.x || velocity.x < -sensitivity.v) {
            handleSwipeLeft(velocity.x);
          }
        }}
      >
        <Box
          width="100%"
          bg="white"
          boxShadow="lg"
          borderRadius={32}
          p={0}
          borderWidth="1px"
          borderColor="gray.200"
          // position="relative"
          overflow="hidden"
        >
          <Box
            width={{ base: '85vw', md: '600px' }}
            height={{ base: '75vh', md: '800px' }}
            backgroundImage={`linear-gradient(to top, rgba(0, 0, 0, 0.95), transparent), url(${movie.image})`}
            backgroundSize="cover"
            backgroundPosition="center"
            position='relative'
          />
          <Box backgroundImage={`url(${movie.image})`}
            position='absolute' top={0} left={0}
          />
          <Box position='absolute' bottom='8rem' left={0} h='6rem' w='100%' pl={6} pr={6}>
            <Box fontSize="2xl" fontWeight="bold" mb={2} color='whiteAlpha.900'>
              {movie.title}
            </Box>
            <Box>
              {movie.tags.map(t => (
                <Badge key={t} colorScheme="green" mr={2}>{t}</Badge>
              ))}              </Box>
            <Flex justifyContent="space-between" alignItems="center">
              <Box fontSize="sm" color="whiteAlpha.900" >
                <Text>Rating: {movie.rating}/10</Text>
              </Box>
              <Box fontSize="sm" color="whiteAlpha.900">
                <Text>Year: {movie.year}</Text>
              </Box>
            </Flex>
          </Box>
        </Box>
      </motion.div>
      <Flex justifyContent="space-between" mt={4} pl={8} pr={8} pt={4}>
        <Circle size="60px" bg={'gray.100'} ><Icon as={MdClose} w={6} h={6} color="red.400" /></Circle>
        <Circle size="60px" bg={'gray.100'} ><Icon as={FaStar} w={6} h={6} color="purple.400" /></Circle>
        <Circle size="60px" bg={'gray.100'} ><Icon as={IoIosHeart} w={6} h={6} color="green.400" /></Circle>
      </Flex>
    </Box>
  );
};