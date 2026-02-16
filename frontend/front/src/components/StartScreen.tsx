import type { FC } from 'react'

type StartScreenProps = {
  reactLogo: string
  javaLogoUrl: string
  onStart: () => void
}

const StartScreen: FC<StartScreenProps> = ({ reactLogo, javaLogoUrl, onStart }) => {
  return (
    <section className="start-screen page-panel">
      <div className="logos-row" aria-label="Tecnologias principales">
        <img src={reactLogo} className="logo react" alt="React logo" />
        <span className="tech-plus" aria-hidden="true">
          +
        </span>
        <img src={javaLogoUrl} className="logo java-mark" alt="Java logo" />
      </div>
      <h1>E-commerce</h1>

      <h4>Creado usando React 18 + Vite para frontend y Java + Maven + Spring Boot para backend.</h4>
      <div className="start-cta">
        <button type="button" className="start-button" onClick={onStart}>
          Comenzar presentacion
        </button>
      </div>
      <button type="button" className="down-arrow panel-down-arrow" aria-label="Desplazarse a productos" onClick={onStart}>
        {'\u2193'}
      </button>
    </section>
  )
}

export default StartScreen
