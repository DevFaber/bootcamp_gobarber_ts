/* eslint-disable camelcase */
/* eslint-disable import/no-duplicates */
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { isToday, format, parseISO, isAfter } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { FiPower, FiClock } from 'react-icons/fi'
import DayPicker, { DayModifiers } from 'react-day-picker'

import 'react-day-picker/lib/style.css'
import { useAuth } from '../../hooks/auth'
import logoImg from '../../assets/barber_logo.svg'
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles'
import api from '../../services/api'

interface MonthDataItem {
  day: number
  available: boolean
}
interface Appointments {
  id: string
  date: string
  formattedHour: string
  user: {
    name: string
    avatar_url: string
  }
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [monthAvailability, setMonthAvailability] = useState<MonthDataItem[]>(
    []
  )
  const [appointments, setAppointments] = useState<Appointments[]>([])
  const { signOut, user } = useAuth()

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day)
    }
  }, [])

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month)
  }, [])

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then((response) => {
        setMonthAvailability(response.data)
      })
  }, [currentMonth, user.id])

  useEffect(() => {
    api
      .get<Appointments[]>('/appointments/yours', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then((response) => {
        const appointmentFormatted = response.data.map((appointment) => {
          return {
            ...appointment,
            formattedHour: format(parseISO(appointment.date), 'HH:mm'),
          }
        })
        setAppointments(appointmentFormatted)
      })
  }, [selectedDate])

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter((monthDay) => monthDay.available === false)
      .map((monthDay) => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()

        return new Date(year, month, monthDay.day)
      })

    return dates
  }, [currentMonth, monthAvailability])

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "dd 'de' MMMM", {
      locale: ptBR,
    })
  }, [selectedDate])

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: ptBR,
    })
  }, [selectedDate])

  const morningAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return parseISO(appointment.date).getHours() < 12
    })
  }, [appointments])

  const afternoonAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return parseISO(appointment.date).getHours() >= 12
    })
  }, [appointments])

  const nextAppointment = useMemo(() => {
    return appointments.find((appointment) =>
      isAfter(parseISO(appointment.date), new Date())
    )
  }, [appointments])

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />

            <div>
              <span>Bem vindo(a),</span>
              <Link to="/profile">{user.name}</Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.formattedHour}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>
            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento para esse horário!</p>
            )}
            {morningAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.formattedHour}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
          <Section>
            <strong>Tarde</strong>

            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento para esse horário!</p>
            )}

            {afternoonAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.formattedHour}
                </span>
                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>

        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  )
}

export default Dashboard
