import {type ReactElement, useState} from 'react'
import './App.css'
import {Paper} from "./components/Paper/Paper.js";
import {Tab, Tabs} from "./components/Tabs/Tabs.js";
import {useRTCPeerConnection} from "./RTC/rtc.peer.js";

function App(): ReactElement {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const {connected, connect, disconnect, chat} = useRTCPeerConnection()

  return (
    <>
      <section >
        <Paper title="Status meeting standup">
          <Tabs>
            <Tab active>Participants (7)</Tab>
            <Tab>Chat</Tab>
          </Tabs>
        </Paper>

        {connected ? (
            <>
              <input value={message} onChange={event => setMessage(event.target.value)}/>
            <button
                className="counter"
                onClick={(): void => chat(message)}
            >
              Send
            </button>
            </>
        ) : (
            <>
              <input value={name} onChange={event => setName(event.target.value)}/>
              <button
                  className="counter"
                  onClick={(): void => connect(name)}
                  disabled={!name}
              >
                Connect
              </button>
            </>
        )}

        {connected ? (
            <button
                className="counter"
                onClick={(): void => disconnect()}
            >
              Disconnect
            </button>
        ): null}
      </section>
    </>
  )
}

export default App
