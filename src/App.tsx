import { useState } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { DialogueBox } from './components/DialogueBox';
import { HUD } from './components/HUD';
import { TitleScreen } from './components/TitleScreen';
import { QuestPanel } from './components/QuestPanel';
import { TitleList } from './components/TitleList';
import { EventBus } from './game/EventBus';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStart = () => {
    setGameStarted(true);
    EventBus.emit('start-bgm');
  };

  return (
    <>
      <PhaserGame />

      {gameStarted && (
        <>
          <HUD />
          <QuestPanel />
          <TitleList />
          <DialogueBox />
        </>
      )}

      {!gameStarted && <TitleScreen onStart={handleStart} />}
    </>
  );
}
