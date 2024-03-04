import React, { useState, useEffect } from "react";
import { Box, Button, Container, FormControl, FormLabel, Heading, Input, List, ListItem, Stack, Text, useToast, VStack } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

const apiBaseUrl = "https://backengine-zq2g.fly.dev";

const Index = () => {
  const [todos, setTodos] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const [todoTitle, setTodoTitle] = useState("");
  const [todoContent, setTodoContent] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (jwtToken) {
      fetchTodos();
    }
  }, [jwtToken]);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/todos`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      toast({ title: error.message, status: "error" });
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json();
      setJwtToken(data.access_token);
    } catch (error) {
      toast({ title: error.message, status: "error" });
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Signup failed");
      }
      await handleLogin();
    } catch (error) {
      toast({ title: error.message, status: "error" });
    }
  };

  const handleCreateTodo = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ title: todoTitle, content: todoContent }),
      });
      if (!response.ok) {
        throw new Error("Create todo failed");
      }
      await fetchTodos();
      setTodoTitle("");
      setTodoContent("");
    } catch (error) {
      toast({ title: error.message, status: "error" });
    }
  };

  return (
    <Container>
      <VStack spacing={4}>
        <Heading>Todo App</Heading>
        {!jwtToken ? (
          <Stack spacing={3}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Button onClick={handleLogin}>Login</Button>
            <Button onClick={handleSignup}>Signup</Button>
          </Stack>
        ) : (
          <>
            <Stack spacing={3}>
              <FormControl isRequired>
                <FormLabel>Todo Title</FormLabel>
                <Input value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Todo Content</FormLabel>
                <Input value={todoContent} onChange={(e) => setTodoContent(e.target.value)} />
              </FormControl>
              <Button leftIcon={<FaPlus />} onClick={handleCreateTodo}>
                Create Todo
              </Button>
            </Stack>
            <Box w="100%">
              <Heading size="md">Your Todos</Heading>
              <List spacing={3}>
                {todos.map((todo, index) => (
                  <ListItem key={index} p={2} shadow="md">
                    <Text fontWeight="bold">{todo.title}</Text>
                    <Text>{todo.content}</Text>
                  </ListItem>
                ))}
              </List>
            </Box>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
