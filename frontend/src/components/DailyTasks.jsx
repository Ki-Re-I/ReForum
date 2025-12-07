import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { getTodayTasks, getCompletedTasksCount, getUserExp } from '../utils/dailyTasks'
import { getLevelFromExp, TASK_EXP } from '../utils/levelSystem'
import './DailyTasks.css'

const DailyTasks = () => {
  const { t } = useLanguage()
  const tasks = getTodayTasks()
  const completedCount = getCompletedTasksCount()
  const userExp = getUserExp()
  const currentLevel = getLevelFromExp(userExp)

  const taskList = [
    {
      key: 'post',
      label: t('tasks.post'),
      completed: tasks.post,
      exp: TASK_EXP.POST,
    },
    {
      key: 'like',
      label: t('tasks.like'),
      completed: tasks.like,
      exp: TASK_EXP.LIKE,
    },
    {
      key: 'comment',
      label: t('tasks.comment'),
      completed: tasks.comment,
      exp: TASK_EXP.COMMENT,
    },
  ]

  return (
    <div className="daily-tasks">
      <div className="tasks-header">
        <h3 className="tasks-title">{t('tasks.title')}</h3>
        <span className="tasks-progress">
          {completedCount}/3 {t('tasks.completed')}
        </span>
      </div>
      <div className="tasks-list">
        {taskList.map((task) => (
          <div
            key={task.key}
            className={`task-item ${task.completed ? 'completed' : ''}`}
          >
            <div className="task-content">
              {task.completed && (
                <span className="task-checkmark">✓</span>
              )}
              <span className="task-label">{task.label}</span>
            </div>
            <span className="task-exp">+{task.exp} {t('tasks.exp')}</span>
          </div>
        ))}
      </div>
      {completedCount === 3 && (
        <div className="tasks-completed-message">
          {t('tasks.allCompleted')}
        </div>
      )}
    </div>
  )
}

export default DailyTasks

