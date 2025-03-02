import { useEffect, useState } from 'react'

function DateViewer(): JSX.Element {
  const [currentDate, setCurrentDate] = useState<string | null>(null)
  useEffect(() => {
    window.api.getCurrentDate().then((date) => {
      setCurrentDate(date)
    })
  }, [])

  return <div>{currentDate}</div>
}

export default DateViewer
