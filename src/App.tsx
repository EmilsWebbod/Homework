import {type ReactElement, useState} from 'react'
import './App.css'
import {Paper} from "./components/Paper/Paper.js";
import {Tab, Tabs} from "./components/Tabs/Tabs.js";
import {Participants} from "./modules/Participants/Participants.js";
import {useRTCPeerConnection} from "./RTC/rtc.peer.js";

const TabType = {
  Participants: 0,
  Chat: 1
}

function App(): ReactElement {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [tab, setTab] = useState<number>(TabType.Participants)
  const {connected, connect, disconnect, chat} = useRTCPeerConnection()

  return (
    <>
      <section >
        <Paper title="Status meeting standup">
          <Tabs>
            <Tab active={tab === TabType.Participants} onClick={(): void => setTab(TabType.Participants)}>
              Participants (7)
            </Tab>
            <Tab active={tab === TabType.Chat} onClick={(): void => setTab(TabType.Chat)}>
              Chat
            </Tab>
          </Tabs>
          {tab === TabType.Participants && (
              <Participants participants={[
                {id: '1', name: 'Emil'},
                {id: '2', name: 'Emil 2'},
              ]}/>
          )}
          {tab === TabType.Chat && (
              <div>Todo</div>
          )}
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
