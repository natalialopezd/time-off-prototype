export interface Member {
  id: number
  name: string
  email: string
  owner: boolean
  admin: boolean
  groups: { id: number; name: string }[]
}

export const GROUPS = {
  engineering: { id: 4001, name: 'Engineering' },
  design: { id: 4002, name: 'Design' },
  marketing: { id: 4003, name: 'Marketing' },
}

export const MEMBERS: Member[] = [
  { id: 3001, name: 'Sarah Chen', email: 'sarah.chen@acme.design', owner: true, admin: true, groups: [GROUPS.marketing] },
  { id: 3002, name: 'Marcus Rivera', email: 'marcus.rivera@acme.design', owner: false, admin: true, groups: [GROUPS.engineering] },
  { id: 3003, name: 'Elena Kowalski', email: 'elena.kowalski@acme.design', owner: false, admin: false, groups: [GROUPS.engineering] },
  { id: 3004, name: 'James Okafor', email: 'james.okafor@acme.design', owner: false, admin: false, groups: [GROUPS.engineering] },
  { id: 3005, name: 'Priya Sharma', email: 'priya.sharma@acme.design', owner: false, admin: false, groups: [GROUPS.design] },
  { id: 3006, name: 'David Kim', email: 'david.kim@acme.design', owner: false, admin: false, groups: [GROUPS.engineering] },
  { id: 3007, name: 'Ana Garcia', email: 'ana.garcia@acme.design', owner: false, admin: false, groups: [GROUPS.design] },
  { id: 3008, name: "Liam O'Brien", email: 'liam.obrien@acme.design', owner: false, admin: false, groups: [GROUPS.engineering] },
  { id: 3009, name: 'Mei Lin', email: 'mei.lin@acme.design', owner: false, admin: false, groups: [GROUPS.design] },
  { id: 3010, name: 'Tomas Herrera', email: 'tomas.herrera@acme.design', owner: false, admin: false, groups: [GROUPS.marketing] },
]

export const TEAMS = [
  { id: 4001, name: 'Engineering', emoji: '\u{1F4BB}', memberIds: [3002, 3003, 3004, 3006, 3008] },
  { id: 4002, name: 'Design', emoji: '\u{1F3A8}', memberIds: [3005, 3007, 3009] },
  { id: 4003, name: 'Marketing', emoji: '\u{1F4E3}', memberIds: [3001, 3010] },
]
