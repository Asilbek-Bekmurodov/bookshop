import { useState, useRef, useEffect } from 'react'
import { Bell, BookOpen, Trophy, Users, Star, X, Check } from 'lucide-react'
import styles from './NotificationDropdown.module.css'

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'borrow',
    icon: BookOpen,
    iconColor: '#d97706',
    title: 'John wants to borrow your book',
    description: '"The Great Gatsby" — John has requested to borrow this from your collection.',
    time: '2 min ago',
    unread: true,
    actionable: true,
  },
  {
    id: 2,
    type: 'challenge',
    icon: Trophy,
    iconColor: '#059669',
    title: 'Reading challenge invitation',
    description: 'Sara invited you to join "50 Books in 2025" reading challenge.',
    time: '18 min ago',
    unread: true,
    actionable: true,
  },
  {
    id: 3,
    type: 'club',
    icon: Users,
    iconColor: '#7c3aed',
    title: 'Book club join request',
    description: 'Alex wants to join your "Classic Literature" reading club.',
    time: '1 hr ago',
    unread: true,
    actionable: true,
  },
  {
    id: 4,
    type: 'recommendation',
    icon: Star,
    iconColor: '#db2777',
    title: 'New book recommendation',
    description: 'Based on your reading history, you might love "Crime and Punishment".',
    time: '3 hrs ago',
    unread: false,
    actionable: false,
  },
  {
    id: 5,
    type: 'borrow',
    icon: BookOpen,
    iconColor: '#d97706',
    title: 'Maria returned your book',
    description: '"1984" has been returned to your collection by Maria.',
    time: 'Yesterday',
    unread: false,
    actionable: false,
  },
]

export default function NotificationDropdown({ overVideo }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [dismissing, setDismissing] = useState(new Set())
  const containerRef = useRef(null)

  const unreadCount = notifications.filter(n => n.unread).length

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const handleAction = (id, action) => {
    setDismissing(prev => new Set(prev).add(id))
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
      setDismissing(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 320)
  }

  const markRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    )
  }

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <button
        className={`${styles.bellBtn} ${overVideo ? styles.bellBtnTransparent : styles.bellBtnSolid} ${open ? styles.bellActive : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={16} strokeWidth={2} />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown} role="dialog" aria-label="Notifications panel">
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.headerTitle}>Notifications</span>
              {unreadCount > 0 && (
                <span className={styles.headerBadge}>{unreadCount} new</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button className={styles.markAllBtn} onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.empty}>
                <Bell size={28} strokeWidth={1.5} className={styles.emptyIcon} />
                <p>All caught up!</p>
                <span>No new notifications</span>
              </div>
            ) : (
              notifications.map(notif => {
                const Icon = notif.icon
                const isDismissing = dismissing.has(notif.id)
                return (
                  <div
                    key={notif.id}
                    className={`${styles.item} ${notif.unread ? styles.itemUnread : ''} ${isDismissing ? styles.itemDismissing : ''}`}
                    onClick={() => markRead(notif.id)}
                  >
                    <div className={styles.iconWrap} style={{ '--icon-color': notif.iconColor }}>
                      <Icon size={15} strokeWidth={2} />
                    </div>

                    <div className={styles.content}>
                      <div className={styles.titleRow}>
                        <span className={styles.itemTitle}>{notif.title}</span>
                        {notif.unread && <span className={styles.dot} />}
                      </div>
                      <p className={styles.desc}>{notif.description}</p>
                      <span className={styles.time}>{notif.time}</span>

                      {notif.actionable && (
                        <div className={styles.actions} onClick={e => e.stopPropagation()}>
                          <button
                            className={styles.acceptBtn}
                            onClick={() => handleAction(notif.id, 'accept')}
                          >
                            <Check size={12} strokeWidth={2.5} />
                            Accept
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() => handleAction(notif.id, 'reject')}
                          >
                            <X size={12} strokeWidth={2.5} />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className={styles.footer}>
            <button className={styles.viewAllBtn}>View all activity</button>
          </div>
        </div>
      )}
    </div>
  )
}
