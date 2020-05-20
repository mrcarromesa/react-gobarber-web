import React, { useState, useMemo, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import {
  format,
  subDays,
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  isBefore,
  isEqual,
  parseISO,
} from 'date-fns';
import pt from 'date-fns/locale/pt';
import { utcToZonedTime } from 'date-fns-tz';
import api from '~/services/api';

import { Container, Time } from './styles';

const range = [];

for (let i = 8; i < 21; i += 1) {
  range.push(i);
}

console.log(range);

function Dashboard() {
  const [schedule, setSchedule] = useState([]);
  const [date, setDate] = useState(new Date());

  const dateFormatted = useMemo(
    () => format(date, "d 'de' MMMM", { locale: pt }),
    [date]
  );

  function hadlePrevDay() {
    setDate(subDays(date, 1));
  }

  function hadleNextDay() {
    setDate(addDays(date, 1));
  }

  useEffect(() => {
    async function loadSchedule() {
      let response = { data: [] };

      try {
        response = await api.get('schendule', {
          params: { date },
        });
      } catch (err) {
        //
      }

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const data = range.map((hour) => {
        const checkDate = setMilliseconds(
          setSeconds(setMinutes(setHours(date, hour), 0), 0),
          0
        );
        const compareDate = utcToZonedTime(checkDate, timezone);

        return {
          time: `${hour}:00h`,
          past: isBefore(compareDate, new Date()),
          appointment: response.data.find((a) => {
            return isEqual(parseISO(a.date), compareDate);
          }),
        };
      });

      setSchedule(data);
    }

    loadSchedule();
  }, [date]);

  return (
    <Container>
      <header>
        <button onClick={hadlePrevDay} type="button">
          <MdChevronLeft size={36} color="#fff" />
        </button>
        <strong>{dateFormatted}</strong>
        <button onClick={hadleNextDay} type="button">
          <MdChevronRight size={36} color="#fff" />
        </button>
      </header>

      <ul>
        {schedule.map((time) => (
          <Time key={time.time} past={time.past} available={!time.appointment}>
            <strong>{time.time}</strong>
            <span>
              {time.appointment ? time.appointment.user.name : 'Em aberto'}
            </span>
          </Time>
        ))}
      </ul>
    </Container>
  );
}

export default Dashboard;
