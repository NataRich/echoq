import { VStack, Image, Text, Divider } from "@chakra-ui/react"
import { useState, ChangeEvent, useEffect } from "react"

import useDebounce from "../../common/hooks/useDebounce"
import OwnerCard from "../../components/qcard/OwnerCard"
import SearchBar from "../../components/searchbar/SearchBar"
import LogoImage from "../../asset/png/logo.png"
import { useQuestion, useQuestionUpdate } from "./QuestionContext"
import { useAlertUpdate } from "../../components/alert/AlertProvider"
import useApiResponse from "../../common/hooks/useApiResponse"
import useLocalStorage, { TOKEN_KEY } from "../../common/hooks/useLocalStorage"

const NewContent = () => {
  const questions = useQuestion()
  const setAlert = useAlertUpdate()
  const { makeRequest } = useApiResponse()
  const { get } = useLocalStorage(TOKEN_KEY)
  const { getQuestions, searchQuestion } = useQuestionUpdate()

  const [search, setSearch] = useState("")

  useEffect(() => {
    getQuestions("unanswered")
  }, [])

  useDebounce(
    () => {
      if (search !== "") searchQuestion(search, "unanswered")
      if (search === "") getQuestions("unanswered")
    },
    500,
    [search]
  )

  const handleEdit = async (
    questionId: number,
    show: boolean,
    questionResponse: string
  ) => {
    const response = await makeRequest({
      path: "/user/respondQuestion",
      method: "POST",
      data: {
        questionid: questionId,
        response: questionResponse,
        visibility: show
      },
      headers: {
        "XXX-SToken": get(),
        "Content-Type": "application/json"
      }
    })
    if (response.status === 200) {
      getQuestions("unanswered")
      setAlert({
        status: "success",
        text: "Succesesfully edited the response",
        show: true
      })
    } else {
      setAlert({
        status: "error",
        text: "Failed to change the response",
        show: true
      })
    }
  }

  const handleTurn = async (questionId: number, show: boolean) => {
    const response = await makeRequest({
      path:
        "/user/updateVisibility?questionId=" +
        questionId +
        "&visibility=" +
        show,
      method: "POST",
      data: null,
      headers: {
        "XXX-SToken": get(),
        "Content-Type": "application/json"
      }
    })
    if (response.status === 200) {
      getQuestions("answered")
      setAlert({
        status: "success",
        text: "Succesesfully changed the visibility",
        show: true
      })
    } else {
      setAlert({
        status: "error",
        text: "Failed to change the visibility",
        show: true
      })
    }
  }

  const handleDelete = async (questionId: number) => {
    const response = await makeRequest({
      path: "/user/deleteQuestion?questionId=" + questionId,
      method: "DELETE",
      data: null,
      headers: {
        "XXX-SToken": get(),
        "Content-Type": "application/json"
      }
    })
    if (response.status === 200) {
      getQuestions("unanswered")
      setAlert({
        status: "success",
        text: "Succesesfully deleted a question and its response",
        show: true
      })
    } else {
      setAlert({
        status: "error",
        text: "Failed to delete a question and its response",
        show: true
      })
    }
  }

  return (
    <>
      <VStack spacing={6}>
        <SearchBar
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
        <Text
          width="calc(100% - 20px)"
          fontSize="md"
          color="gray.400"
          fontStyle="italic"
        >
          {questions.length} results...
        </Text>
        <VStack width="100%" spacing={5} divider={<Divider />}>
          {questions.map(({ order, questionId, question, show, askedAt }) => {
            return (
              <OwnerCard
                key={order}
                order={order}
                questionId={questionId}
                question={question}
                show={show}
                askedAt={new Date(askedAt)}
                handleEdit={handleEdit}
                handleTurn={handleTurn}
                handleDelete={handleDelete}
              />
            )
          })}
        </VStack>
      </VStack>
      <div className="echo-content-logo-container">
        <Image borderRadius="full" boxSize="100px" src={LogoImage} alt="" />
        <Text layerStyle="appnameText" textStyle="appnameText">
          Echoq
        </Text>
      </div>
    </>
  )
}

export default NewContent
