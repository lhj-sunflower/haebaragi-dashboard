import { useEffect, useMemo, useState } from 'react'
import './App.css'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wtvhghduhnyefewuvcpc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0dmhnaGR1aG55ZWZld3V2Y3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODg5NjksImV4cCI6MjA5MzI2NDk2OX0.fyjCAAszJqaBi8c0NdiUZdGlPOFlMOoUwoAdvQbdOUY'
)
const STORAGE_KEY = 'haebaragi-puppyhouse-final-dashboard-v3'
const LEGACY_KEY = 'haebaragi-puppyhouse-final-dashboard-v2'
const today = '2026-05-02'
const LOGIN_KEY = 'haebaragi-current-user'
const AUTH_USERS = [
  { id: 'admin', name: '관리자', role: 'admin', password: '0505' },
  { id: 'user', name: '사용자', role: 'user', password: '0505' },
]
const currentMonth = '2026-05'

const tabs = ['메인', '미용/케어', '분양관리', '매장용품관리', '고객관리', '회계/비용장부', '통합데이터']
const staffList = ['원장님', '예슬님']
const statusList = ['예약확정', '진행중', '취소']
const paymentStatusList = ['미결제', '결제완료', '부분결제']
const itemTypes = ['사료', '간식', '패드', '목욕용품', '기타']
const serviceTypes = ['미용', '목욕', '위생케어', '스파', '기타']
const additionalOptions = ['없음', '가위컷', '스파', '약용샴푸', '발톱정리', '귀청소', '항문낭', '사진촬영', '기타']
const genderOptions = ['남아', '여아']
const visitPathOptions = ['네이버 검색', '네이버 플레이스', '인스타그램', '지인추천', '매장 지나가다', '기존고객 소개', '전단/현수막', '기타']
const puppyStatusList = ['입소', '상담중', '예약중', '계약진행', '입양완료', '보류', '치료중']
const adoptionMenus = ['퍼피 매칭관리', '퍼피 프로파일', '퍼피 입양 관리 내역']
const settlementStatusList = ['미정산', '정산완료', '확인필요']
const processStatusList = ['처리완료', '확인필요', '대기']
const accountingTabs = ['당일 수익·비용', '월별 장부', '수익/비용 내역', '영수증 관리', '예슬님 정산']
const SUPABASE_TABLES = {
  customers: 'customers',
  groomingReservations: 'grooming_reservations',
  adoptionConsultations: 'adoption_consultations',
  puppies: 'puppies',
  supplyPurchases: 'supply_purchases',
  accountingEntries: 'accounting_entries',
  settlementEntries: 'settlement_entries',
}
const SUPABASE_DATA_KEYS = ['groomingReservations', 'adoptionConsultations', 'puppies', 'supplyPurchases', 'accountingEntries', 'settlementEntries']

const seedData = {
  groomingReservations: [
    { id: 'g-1', date: today, time: '09:30', staff: '원장님', dogName: '콩이', breed: '시츄', guardianName: '김민지', phone: '010-1234-1001', serviceType: '위생케어', options: '기타', status: '예약확정', paymentStatus: '미결제', paymentMethod: '카드', price: 65000, customerType: '기존 고객', memo: '겁이 많아서 천천히 진행' },
    { id: 'g-2', date: today, time: '11:00', staff: '예슬님', dogName: '해피', breed: '시츄', guardianName: '박지훈', phone: '010-1234-1002', serviceType: '미용', options: '사진촬영', status: '완료', paymentStatus: '결제완료', paymentMethod: '카드', price: 80000, customerType: '기존 고객', memo: '예슬님 정산 대상' },
    { id: 'g-3', date: today, time: '14:00', staff: '원장님', dogName: '루루', breed: '말티즈', guardianName: '최서연', phone: '010-1234-1003', serviceType: '스파', options: '약용샴푸', status: '확인필요', paymentStatus: '미결제', paymentMethod: '현금', price: 45000, customerType: '신규 고객', memo: '피부 붉은기 확인 필요' },
    { id: 'g-4', date: today, time: '16:30', staff: '예슬님', dogName: '보리', breed: '푸들', guardianName: '정하늘', phone: '010-1234-1004', serviceType: '미용', options: '발톱정리', status: '확인필요', paymentStatus: '미결제', paymentMethod: '카드', price: 35000, customerType: '기존 고객', memo: '보호자 일정 재확인' },
    { id: 'g-5', date: '2026-05-06', time: '10:30', staff: '원장님', dogName: '모카', breed: '시츄', guardianName: '이아린', phone: '010-1234-1005', serviceType: '목욕', options: '발톱정리', status: '예약확정', paymentStatus: '미결제', paymentMethod: '카드', price: 50000, customerType: '재방문', memo: '간식 알러지 있음' },
  ],
  adoptionConsultations: [
    { id: 'a-1', date: today, dogName: '해님', breed: '시츄', guardianName: '오지은', phone: '010-2222-1001', consultant: '퍼피 컨설턴트', status: '상담중', price: 950000, paymentMethod: '계좌이체', memo: '가족과 재방문 예정' },
    { id: 'a-2', date: today, dogName: '달님', breed: '말티즈', guardianName: '문태오', phone: '010-2222-1002', consultant: '퍼피 컨설턴트', status: '확인필요', price: 1100000, paymentMethod: '카드', memo: '예방접종 기록 전달' },
    { id: 'a-3', date: '2026-05-03', dogName: '구름', breed: '푸들', guardianName: '송유나', phone: '010-2222-1003', consultant: '퍼피 컨설턴트', status: '입양완료', price: 1250000, paymentMethod: '계좌이체', memo: '계약서 작성 완료' },
  ],
  puppies: [
    { id: 'p-1', profileNo: 'P-2026-001', name: '해님', breed: '시츄', gender: '여아', birth: '2026-02-10', ageMonths: '3개월', coatColor: '크림', arrival: '2026-04-18', source: '서울 협력켄넬', intakeAmount: 520000, adoptionPrice: 950000, status: '상담중', healthStatus: '양호', vaccination: '2차 완료', photoName: '', guardianName: '오지은', phone: '010-2222-1001', consultant: '퍼피 컨설턴트', memo: '식욕 좋음' },
    { id: 'p-2', profileNo: 'P-2026-002', name: '달님', breed: '말티즈', gender: '남아', birth: '2026-02-20', ageMonths: '2개월', coatColor: '아이보리', arrival: '2026-04-21', source: '부산 협력켄넬', intakeAmount: 610000, adoptionPrice: 1100000, status: '상담중', healthStatus: '양호', vaccination: '1차 완료', photoName: '', guardianName: '문태오', phone: '010-2222-1002', consultant: '퍼피 컨설턴트', memo: '활발함' },
    { id: 'p-3', profileNo: 'P-2026-003', name: '구름', breed: '푸들', gender: '여아', birth: '2026-01-29', ageMonths: '3개월', coatColor: '브라운', arrival: '2026-04-01', source: '대전 협력켄넬', intakeAmount: 700000, adoptionPrice: 1250000, status: '입양완료', healthStatus: '양호', vaccination: '3차 완료', photoName: '', guardianName: '송유나', phone: '010-2222-1003', consultant: '퍼피 컨설턴트', completedDate: '2026-05-03', memo: '입양 완료' },
  ],
  supplyPurchases: [
    { id: 's-1', date: today, vendor: '해피펫 대리점', itemType: '사료', summary: '시츄 퍼피 사료 외', totalAmount: 280000, paymentMethod: '계좌이체', status: '처리완료', receiptAttached: true, receiptName: '해피펫_매입영수증.jpg', memo: '월초 기본 발주' },
    { id: 's-2', date: '2026-05-01', vendor: '펫케어유통', itemType: '목욕용품', summary: '샴푸/컨디셔너', totalAmount: 165000, paymentMethod: '카드', status: '처리완료', receiptAttached: false, receiptName: '', memo: '미용실 재고 보충' },
  ],
  accountingEntries: [],
  settlementEntries: [],
}

function replaceRole(value) {
  const oldWithSpace = '분양' + ' 실장님'
  const oldWithoutSpace = '분양' + '실장님'
  return String(value || '').replaceAll(oldWithSpace, '퍼피 컨설턴트').replaceAll(oldWithoutSpace, '퍼피 컨설턴트')
}
function phoneDigits(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 11)
}
function formatPhoneNumber(value) {
  const digits = phoneDigits(value)
  if (!digits) return ''
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return digits.slice(0, 3) + '-' + digits.slice(3)
  if (digits.length <= 10) return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6)
  return digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7)
}
function formatPhone(value) {
  return formatPhoneNumber(value)
}
function isPhoneField(key, label) {
  const field = String(key || '')
  const text = String(label || '')
  return /phone/i.test(field) || ['ownerPhone', 'guardianPhone', 'phone'].includes(field) || /전화|연락|핸드폰|휴대폰/i.test(text)
}
function matchesSearch(values, query) {
  const keyword = String(query || '').trim()
  if (!keyword) return true
  const keywordDigits = phoneDigits(keyword)
  return values.some((value) => {
    const text = String(value || '')
    return text.includes(keyword) || (keywordDigits && phoneDigits(text).includes(keywordDigits))
  })
}
function isRemovedContactStatus(value) {
  return [String.fromCharCode(51116) + '연락필요'].includes(String(value || ''))
}
function appendMemo(memo, note) {
  return [memo, note].filter(Boolean).join(' / ')
}
function normalizeGroomingStatus(value) {
  const status = String(value || '').trim()
  if (status === '취소') return '취소'
  if (status === '진행중' || status === '완료' || status === '결제완료') return '진행중'
  return '예약확정'
}
function isCanceledGrooming(item) {
  return normalizeGroomingStatus(item?.status) === '취소'
}
function samePhone(left, right) {
  const a = phoneDigits(left)
  const b = phoneDigits(right)
  return Boolean(a && b && a === b)
}
function missingText(value, fallback = '-') {
  const text = String(value ?? '').trim()
  return text || fallback
}
function formatHistoryDate(value) {
  return value ? formatDateWithDay(value) : '날짜 미등록'
}
function formatHistoryAmount(value) {
  return value === undefined || value === null || value === '' ? '-' : currency(value)
}
function toGrooming(item) {
  const status = isRemovedContactStatus(item.status) ? '확인필요' : item.status
  return {
    id: item.id || `g-${Date.now()}`,
    date: item.date || today,
    time: item.time || '10:00',
    staff: replaceRole(item.staff) || '원장님',
    dogName: item.dogName || item.dog || item.name || '',
    breed: item.breed || '시츄',
    guardianName: item.guardianName || item.guardian || '',
    phone: formatPhoneNumber(item.phone || item.ownerPhone || item.guardianPhone || ''),
    serviceType: serviceTypes.includes(item.serviceType) ? item.serviceType : (item.serviceType || item.service || '미용'),
    options: additionalOptions.includes(item.options) ? item.options : (item.options || '없음'),
    status: normalizeGroomingStatus(status),
    paymentStatus: item.paymentStatus || (item.status === '결제완료' ? '결제완료' : '미결제'),
    paymentMethod: item.paymentMethod || item.payment || '카드',
    price: Number(item.price || 0),
    customerType: item.customerType || '기존 고객',
    memo: item.memo || '',
  }
}
function toAdoption(item) {
  const status = isRemovedContactStatus(item.status) ? '상담중' : item.status
  return {
    id: item.id || `a-${Date.now()}`,
    date: item.date || today,
    dogName: item.dogName || item.dog || item.name || '',
    breed: item.breed || '시츄',
    guardianName: item.guardianName || item.guardian || '',
    phone: formatPhoneNumber(item.phone || item.ownerPhone || item.guardianPhone || ''),
    consultant: replaceRole(item.consultant || item.counselor || '퍼피 컨설턴트'),
    status: status === ('분양' + '완료') ? '입양완료' : (status || '상담중'),
        price: Number(item.price || 0),
    paymentMethod: item.paymentMethod || '계좌이체',
    memo: item.memo || '',
  }
}
function toPuppy(item) {
  return {
    id: item.id || 'p-' + Date.now(),
    profileNo: item.profileNo || item.id || 'P-' + Date.now(),
    name: item.name || item.dogName || '',
    breed: item.breed || '시츄',
    gender: item.gender || '',
    birth: item.birth || '',
    ageMonths: item.ageMonths || item.age || '',
    coatColor: item.coatColor || '',
    arrival: item.arrival || item.inDate || '',
    source: item.source || '',
    intakeAmount: Number(item.intakeAmount || 0),
    adoptionPrice: Number(item.adoptionPrice || item.finalPrice || item.price || 0),
    status: item.status === ('분양' + '완료') ? '입양완료' : (item.status || '입소'),
    healthStatus: item.healthStatus || '',
    vaccination: item.vaccination || '',
    photoName: item.photoName || '',
    guardianName: item.guardianName || item.guardian || '',
    phone: formatPhoneNumber(item.phone || item.ownerPhone || item.guardianPhone || ''),
    consultant: replaceRole(item.consultant || item.counselor || '퍼피 컨설턴트'),
    completedDate: item.completedDate || item.outgoing || '',
    memo: item.memo || '',
  }
}
function isAdoptedPuppy(puppy) {
  return ['입양완료', '분양완료'].includes(puppy?.status)
}
function activePuppyRows(puppies) {
  return puppies.filter((puppy) => !isAdoptedPuppy(puppy))
}
function adoptionFromPuppy(puppy) {
  return toAdoption({
    id: 'adopt-' + (puppy.profileNo || puppy.id),
    date: puppy.completedDate || today,
    dogName: puppy.name,
    breed: puppy.breed,
    guardianName: puppy.guardianName,
    phone: formatPhoneNumber(puppy.phone),
    consultant: puppy.consultant || '퍼피 컨설턴트',
    status: '입양완료',
    price: puppy.adoptionPrice,
    paymentMethod: '계좌이체',
    memo: puppy.memo,
  })
}
function toSupply(item) {
  return {
    id: item.id || `s-${Date.now()}`,
    date: item.date || today,
    vendor: item.vendor || '',
    itemType: item.itemType || item.type || '사료',
    summary: item.summary || '',
    totalAmount: Number(item.totalAmount ?? item.amount ?? 0),
    paymentMethod: item.paymentMethod || item.payment || '카드',
    status: item.status || '처리완료',
    receiptAttached: Boolean(item.receiptAttached),
    receiptName: item.receiptName || '',
    memo: item.memo || '',
  }
}
function toAccounting(item) {
  return {
    id: item.id || `acc-${Date.now()}`,
    date: item.date || today,
    type: item.type || '수익',
    category: item.category || '기타',
    title: item.title || item.summary || '직접 입력',
    customerVendor: item.customerVendor || item.vendor || '',
    dogName: item.dogName || item.dog || '',
    guardianName: item.guardianName || item.guardian || '',
    staff: replaceRole(item.staff) || '공통',
    amount: Number(item.amount || 0),
    paymentMethod: item.paymentMethod || item.payment || '카드',
    status: item.status || '처리완료',
    settlementStatus: item.settlementStatus || '-',
    receiptAttached: Boolean(item.receiptAttached),
    receiptName: item.receiptName || '',
    memo: item.memo || '',
    sourceKind: item.sourceKind || 'manual',
    sourceId: item.sourceId || item.source || item.id || '',
  }
}
function accountingFromGrooming(item) {
  return {
    id: `acc-grooming-${item.id}`,
    date: item.date,
    type: '수익',
    category: '미용매출',
    title: `${item.dogName} ${item.serviceType}`,
    customerVendor: item.guardianName,
    dogName: item.dogName,
    guardianName: item.guardianName,
    staff: item.staff,
    amount: Number(item.price || 0),
    paymentMethod: item.paymentMethod,
    status: '처리완료',
    settlementStatus: item.staff === '예슬님' ? '미정산' : '-',
    receiptAttached: false,
    receiptName: '',
    memo: '미용/케어 결제완료 자동 반영',
    sourceKind: 'grooming',
    sourceId: item.id,
  }
}
function accountingFromAdoption(item) {
  return {
    id: `acc-adoption-${item.id}`,
    date: item.date || today,
    type: '수익',
    category: '분양매출',
    title: `${item.dogName} 입양완료`,
    customerVendor: item.guardianName,
    dogName: item.dogName,
    guardianName: item.guardianName,
    staff: item.consultant,
    amount: Number(item.price || 0),
    paymentMethod: item.paymentMethod,
    status: '처리완료',
    settlementStatus: '-',
    receiptAttached: false,
    receiptName: '',
    memo: '입양완료 자동 반영',
    sourceKind: 'adoption',
    sourceId: item.id,
  }
}
function accountingFromSupply(item) {
  return {
    id: `acc-supply-${item.id}`,
    date: item.date,
    type: '비용',
    category: '매장용품',
    title: item.summary || `${item.vendor} 매입`,
    customerVendor: item.vendor,
    dogName: '',
    guardianName: '',
    staff: '공통',
    amount: Number(item.totalAmount || 0),
    paymentMethod: item.paymentMethod,
    status: item.status || '처리완료',
    settlementStatus: '-',
    receiptAttached: Boolean(item.receiptAttached),
    receiptName: item.receiptName || '',
    memo: item.memo || '매입 등록 자동 반영',
    sourceKind: 'supply',
    sourceId: item.id,
  }
}
function settlementFromGrooming(item, previous) {
  const old = previous.find((entry) => entry.groomingId === item.id)
  return {
    id: `set-${item.id}`,
    date: item.date,
    groomingId: item.id,
    dogName: item.dogName,
    guardianName: item.guardianName,
    salesAmount: Number(item.price || 0),
    settlementAmount: Math.round(Number(item.price || 0) * 0.6),
    status: old?.status || '미정산',
    memo: old?.memo || '',
  }
}
function supabaseRowId(item, fallback) {
  return String(item?.id || item?.phone || item?.profileNo || fallback)
}
function collectionRowsForSupabase(key, rows) {
  return (rows || []).map((item, index) => ({ id: supabaseRowId(item, key + '-' + index), data: item }))
}
async function readSupabaseCollection(key) {
  const table = SUPABASE_TABLES[key]
  if (!table) return []
  const { data: rows, error } = await supabase.from(table).select('id,data').order('updated_at', { ascending: false })
  if (error) throw error
  return (rows || []).map((row) => ({ id: row.id, ...(row.data || {}) }))
}
async function loadSupabaseDashboardData() {
  const result = {}
  let foundRemoteRows = false
  await Promise.all(SUPABASE_DATA_KEYS.map(async (key) => {
    const rows = await readSupabaseCollection(key)
    result[key] = rows
    if (rows.length > 0) foundRemoteRows = true
  }))
  return foundRemoteRows ? normalizeData({ ...seedData, ...result }) : null
}
async function syncSupabaseCollection(key, rows) {
  const table = SUPABASE_TABLES[key]
  if (!table) return
  const localRows = collectionRowsForSupabase(key, rows)
  const localIds = new Set(localRows.map((row) => row.id))
  if (localRows.length > 0) {
    const { error } = await supabase.from(table).upsert(localRows, { onConflict: 'id' })
    if (error) throw error
  }
  const { data: remoteRows, error: selectError } = await supabase.from(table).select('id')
  if (selectError) throw selectError
  const deleteIds = (remoteRows || []).map((row) => String(row.id)).filter((id) => !localIds.has(id))
  if (deleteIds.length > 0) {
    const { error: deleteError } = await supabase.from(table).delete().in('id', deleteIds)
    if (deleteError) throw deleteError
  }
}
async function syncDashboardToSupabase(data, customers) {
  await Promise.all([
    syncSupabaseCollection('customers', customers),
    ...SUPABASE_DATA_KEYS.map((key) => syncSupabaseCollection(key, data[key] || [])),
  ])
}
function syncDerivedData(data) {
  const manualEntries = data.accountingEntries.filter((entry) => !['grooming', 'adoption', 'supply'].includes(entry.sourceKind))
  const groomingEntries = data.groomingReservations.filter((item) => item.paymentStatus === '결제완료').map(accountingFromGrooming)
  const adoptionEntries = data.adoptionConsultations.filter((item) => item.status === '입양완료').map(accountingFromAdoption)
  const supplyEntries = data.supplyPurchases.map(accountingFromSupply)
  const settlementEntries = data.groomingReservations.filter((item) => item.staff === '예슬님' && item.paymentStatus === '결제완료').map((item) => settlementFromGrooming(item, data.settlementEntries || []))
  return { ...data, accountingEntries: [...manualEntries, ...groomingEntries, ...adoptionEntries, ...supplyEntries], settlementEntries }
}
function normalizeData(raw) {
  const legacy = raw || {}
  const normalized = {
    groomingReservations: (legacy.groomingReservations || legacy.grooming || seedData.groomingReservations).map(toGrooming),
    adoptionConsultations: (legacy.adoptionConsultations || legacy.adoptions || seedData.adoptionConsultations).map(toAdoption),
    puppies: legacy.puppies || seedData.puppies,
    supplyPurchases: (legacy.supplyPurchases || legacy.supplies || seedData.supplyPurchases).map(toSupply),
    accountingEntries: (legacy.accountingEntries || legacy.ledger || seedData.accountingEntries).map(toAccounting),
    settlementEntries: legacy.settlementEntries || seedData.settlementEntries,
  }
  return syncDerivedData(normalized)
}
function hasLocalDashboardBackup() {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY))
  } catch {
    return false
  }
}
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY)
    return normalizeData(saved ? JSON.parse(saved) : seedData)
  } catch {
    return normalizeData(seedData)
  }
}
function normalizeLoginSession(saved) {
  if (!saved) return null
  if (saved.id === 'admin' || saved.role === 'admin') return { id: 'admin', name: '관리자', role: 'admin' }
  if (['user', 'director', 'yesul', 'consultant', 'staff'].includes(saved.id) || ['user', 'director', 'staff', 'consultant'].includes(saved.role)) return { id: 'user', name: '사용자', role: 'user' }
  return null
}
function loadLoginUser() {
  try {
    return normalizeLoginSession(JSON.parse(localStorage.getItem(LOGIN_KEY) || 'null'))
  } catch {
    return null
  }
}
function isAdmin(user) {
  return user?.role === 'admin'
}
function isRestrictedTab(tab) {
  return ['회계/비용장부', '통합데이터'].includes(tab)
}
function currency(value) {
  return `${Number(value || 0).toLocaleString('ko-KR')}원`
}
function petLabel(item) {
  return `${item.dogName || item.name || item.title} (${item.guardianName || '보호자 미정'})`
}
function defaultGroomingForm() {
  return { date: today, time: '18:00', staff: '원장님', dogName: '', breed: '시츄', gender: '남아', ageMonths: '3개월', guardianName: '', phone: '', serviceType: '미용', options: '없음', status: '예약확정', paymentStatus: '미결제', paymentMethod: '카드', price: 0, customerType: '신규 고객', memo: '', visitPath: '네이버 검색' }
}
function defaultSupplyForm() {
  return { date: today, vendor: '', itemType: '사료', summary: '', totalAmount: 0, paymentMethod: '카드', status: '처리완료', receiptAttached: false, receiptName: '', memo: '' }
}
function defaultAccountingForm() {
  return { date: today, type: '수익', category: '직접입력', title: '', customerVendor: '', dogName: '', guardianName: '', staff: '공통', amount: 0, paymentMethod: '카드', status: '처리완료', settlementStatus: '-', receiptAttached: false, receiptName: '', memo: '', sourceKind: 'manual', sourceId: '' }
}
function parseDateValue(value) {
  if (!value) return Number.POSITIVE_INFINITY
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return new Date(String(value) + 'T00:00:00').getTime()
  const parsed = new Date(value).getTime()
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed
}
function parseTimeValue(value) {
  const match = String(value || '').match(/(\d{1,2}):(\d{2})/)
  if (!match) return Number.POSITIVE_INFINITY
  return Number(match[1]) * 60 + Number(match[2])
}
function sortByDateTime(data) {
  return [...(data || [])].sort((a, b) => {
    const dateDiff = parseDateValue(a.date || a.completedDate || a.arrival) - parseDateValue(b.date || b.completedDate || b.arrival)
    if (dateDiff !== 0) return dateDiff
    return parseTimeValue(a.time) - parseTimeValue(b.time)
  })
}
function dateOffset(baseDate, offsetDays) {
  const date = new Date(baseDate + 'T00:00:00')
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().slice(0, 10)
}
function currentDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return year + '-' + month + '-' + day
}
function currentMinuteOfDay() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}
function minutesUntilReservation(item) {
  const reservationTime = parseTimeValue(item.time)
  if (!Number.isFinite(reservationTime)) return Number.POSITIVE_INFINITY
  const nowMinutes = currentDateString() === item.date ? currentMinuteOfDay() : -1
  return reservationTime - nowMinutes
}
function isUpcomingTodayReservation(item) {
  return item.date === today && !isCanceledGrooming(item) && minutesUntilReservation(item) >= 0
}
function isWithinThirtyMinutes(item) {
  const minutes = minutesUntilReservation(item)
  return minutes >= 0 && minutes <= 30
}
function monthDays(month, grooming, adoptions) {
  const [year, monthNumber] = month.split('-').map(Number)
  const last = new Date(year, monthNumber, 0).getDate()
  const firstDay = new Date(year, monthNumber - 1, 1).getDay()
  const blanks = Array.from({ length: firstDay }, (_, index) => ({ key: `blank-${index}`, blank: true }))
  const days = Array.from({ length: last }, (_, index) => {
    const day = String(index + 1).padStart(2, '0')
    const date = `${month}-${day}`
    const entries = sortByDateTime([...grooming.filter((item) => item.date === date), ...adoptions.filter((item) => item.date === date)])
    return { key: date, date, label: index + 1, entries }
  })
  return [...blanks, ...days]
}

function escapeXml(value) {
  return String(value ?? '').replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[char]))
}
function columnName(index) {
  let name = ''
  let value = index + 1
  while (value > 0) {
    const mod = (value - 1) % 26
    name = String.fromCharCode(65 + mod) + name
    value = Math.floor((value - mod) / 26)
  }
  return name
}
function crc32(text) {
  const table = crc32.table || (crc32.table = Array.from({ length: 256 }, (_, index) => {
    let value = index
    for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
    return value >>> 0
  }))
  const bytes = new TextEncoder().encode(text)
  let crc = 0xffffffff
  bytes.forEach((byte) => { crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8) })
  return (crc ^ 0xffffffff) >>> 0
}
function byteText(text) {
  return new TextEncoder().encode(text)
}
function concatBytes(parts) {
  const size = parts.reduce((sum, part) => sum + part.length, 0)
  const out = new Uint8Array(size)
  let offset = 0
  parts.forEach((part) => { out.set(part, offset); offset += part.length })
  return out
}
function uint16(value) { return Uint8Array.from([value & 255, (value >>> 8) & 255]) }
function uint32(value) { return Uint8Array.from([value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255]) }
function makeZip(files) {
  let offset = 0
  const localParts = []
  const centralParts = []
  files.forEach((file) => {
    const name = byteText(file.name)
    const content = byteText(file.content)
    const crc = crc32(file.content)
    localParts.push(byteText('PK\x03\x04'), uint16(20), uint16(0), uint16(0), uint16(0), uint16(0), uint16(0), uint32(crc), uint32(content.length), uint32(content.length), uint16(name.length), uint16(0), name, content)
    centralParts.push(byteText('PK\x01\x02'), uint16(20), uint16(20), uint16(0), uint16(0), uint16(0), uint16(0), uint16(0), uint32(crc), uint32(content.length), uint32(content.length), uint16(name.length), uint16(0), uint16(0), uint16(0), uint16(0), uint32(0), uint32(offset), name)
    offset += 30 + name.length + content.length
  })
  const central = concatBytes(centralParts)
  const local = concatBytes(localParts)
  const end = concatBytes([byteText('PK\x05\x06'), uint16(0), uint16(0), uint16(files.length), uint16(files.length), uint32(central.length), uint32(local.length), uint16(0)])
  return concatBytes([local, central, end])
}
function downloadXlsx(rows, columns, filename) {
  const header = columns.map((column) => column.label)
  const body = [header, ...rows.map((row) => columns.map((column) => row[column.key] ?? ''))]
  const sheetRows = body.map((row, rowIndex) => '<row r="' + (rowIndex + 1) + '">' + row.map((value, columnIndex) => '<c r="' + columnName(columnIndex) + (rowIndex + 1) + '" t="inlineStr"><is><t>' + escapeXml(value) + '</t></is></c>').join('') + '</row>').join('')
  const sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetData>' + sheetRows + '</sheetData></worksheet>'
  const workbook = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="통합데이터" sheetId="1" r:id="rId1"/></sheets></workbook>'
  const rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'
  const workbookRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'
  const contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'
  const zip = makeZip([{ name: '[Content_Types].xml', content: contentTypes }, { name: '_rels/.rels', content: rels }, { name: 'xl/workbook.xml', content: workbook }, { name: 'xl/_rels/workbook.xml.rels', content: workbookRels }, { name: 'xl/worksheets/sheet1.xml', content: sheet }])
  const blob = new Blob([zip], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}
function buildStatsRows(data) {
  const rows = []
  data.groomingReservations.forEach((item) => rows.push({ id: 'stat-g-' + item.id, date: item.date, category: '미용', dogName: item.dogName, breed: item.breed, guardianName: item.guardianName, phone: formatPhoneNumber(item.phone), staff: item.staff, content: [item.serviceType, item.options].filter(Boolean).join(' / '), status: [item.status, item.paymentStatus].filter(Boolean).join(' / '), amount: Number(item.price || 0), memo: item.memo || '' }))
  data.adoptionConsultations.forEach((item) => rows.push({ id: 'stat-a-' + item.id, date: item.date, category: item.status === '입양완료' ? '입양' : '상담', dogName: item.dogName, breed: item.breed, guardianName: item.guardianName, phone: formatPhoneNumber(item.phone), staff: replaceRole(item.consultant), content: '퍼피 매칭관리', status: item.status, amount: Number(item.price || 0), memo: item.memo || '' }))
  data.puppies.forEach((item) => rows.push({ id: 'stat-p-' + item.id, date: item.completedDate || item.arrival || today, category: item.status === '입양완료' ? '입양 관리' : '퍼피 프로파일', dogName: item.name || item.dogName, breed: item.breed, guardianName: item.guardianName, phone: formatPhoneNumber(item.phone), staff: replaceRole(item.consultant), content: item.profileNo || '퍼피 프로파일', status: item.status, amount: Number(item.adoptionPrice || item.finalPrice || item.intakeAmount || 0), memo: item.memo || '' }))
  data.supplyPurchases.forEach((item) => rows.push({ id: 'stat-s-' + item.id, date: item.date, category: '매입', dogName: '', breed: '', guardianName: item.vendor, phone: '', staff: '매장', content: [item.itemType, item.summary].filter(Boolean).join(' / '), status: item.status, amount: Number(item.totalAmount || 0), memo: item.memo || '' }))
  data.accountingEntries.forEach((item) => rows.push({ id: 'stat-acc-' + item.id, date: item.date, category: item.type || '회계', dogName: item.dogName, breed: '', guardianName: item.guardianName || item.customerVendor, phone: formatPhoneNumber(item.phone || item.ownerPhone || item.guardianPhone || ''), staff: item.staff, content: item.title, status: item.status, amount: Number(item.amount || 0), memo: item.memo || '' }))
  return rows.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
}
function todayStamp() { return today.replaceAll('-', '') }

function loadCustomerMemos() {
  try {
    return JSON.parse(localStorage.getItem('customerMemos') || '{}')
  } catch {
    return {}
  }
}
function loadDeletedCustomerPhones() {
  try {
    return JSON.parse(localStorage.getItem('deletedCustomerPhones') || '[]')
  } catch {
    return []
  }
}
function buildCustomers(data) {
  const map = new Map()
  const touch = (phone, patch) => {
    if (!phone) return
    const current = map.get(phone) || { phone, guardianName: '', dogName: '', breed: '', grooming: 0, adoption: 0, visitCount: 0, totalPaid: 0, lastVisitDate: '', specialNote: '', dogNames: new Set(), breeds: new Set() }
    current.guardianName = patch.guardianName || current.guardianName
    current.specialNote = patch.specialNote || current.specialNote
    if (patch.dogName) current.dogNames.add(patch.dogName)
    if (patch.breed) current.breeds.add(patch.breed)
    current.grooming += patch.grooming || 0
    current.adoption += patch.adoption || 0
    current.visitCount += patch.visitCount || 0
    current.totalPaid += Number(patch.totalPaid || 0)
    if (patch.date && (!current.lastVisitDate || patch.date > current.lastVisitDate)) current.lastVisitDate = patch.date
    map.set(phone, current)
  }

  data.groomingReservations.forEach((item) => {
    touch(item.phone, {
      guardianName: item.guardianName,
      dogName: item.dogName,
      breed: item.breed,
      grooming: 1,
      visitCount: 1,
      date: item.date,
      totalPaid: item.paymentStatus === '결제완료' ? item.price : 0,
      specialNote: item.specialNote || item.memo,
    })
  })
  data.adoptionConsultations.forEach((item) => {
    const completed = ['입양완료', '분양완료'].includes(item.status)
    touch(item.phone, {
      guardianName: item.guardianName,
      dogName: item.dogName,
      breed: item.breed,
      adoption: 1,
      visitCount: 1,
      date: item.completedDate || item.date,
      totalPaid: completed ? item.price : 0,
      specialNote: item.specialNote || item.memo,
    })
  })
  data.puppies.filter((item) => item.phone || item.guardianName).forEach((item) => {
    const completed = ['입양완료', '분양완료'].includes(item.status)
    touch(item.phone, {
      guardianName: item.guardianName,
      dogName: item.dogName || item.name,
      breed: item.breed,
      adoption: completed ? 1 : 0,
      visitCount: completed ? 1 : 0,
      date: item.completedDate || item.date || item.arrival,
      totalPaid: completed ? item.finalPrice || item.adoptionPrice : 0,
      specialNote: item.specialNote || item.memo,
    })
  })

  return Array.from(map.values()).map((customer) => {
    const dogNames = Array.from(customer.dogNames).filter(Boolean)
    const breeds = Array.from(customer.breeds).filter(Boolean)
    const grade = customer.visitCount >= 10 || customer.totalPaid >= 1000000 ? 'VIP' : customer.visitCount >= 5 ? '단골' : customer.visitCount >= 2 ? '재방문' : '신규'
    return {
      ...customer,
      dogName: dogNames.join(', ') || customer.dogName || '-',
      breed: breeds.join(', ') || customer.breed || '-',
      grade,
      customerType: [customer.grooming > 0 ? '미용고객' : null, customer.adoption > 0 ? '입양고객' : null].filter(Boolean).join(' · ') || '일반고객',
      badges: [grade, customer.grooming > 0 ? '미용고객' : null, customer.adoption > 0 ? '입양고객' : null].filter(Boolean),
    }
  }).sort((a, b) => String(a.guardianName).localeCompare(String(b.guardianName), 'ko'))
}
function validDateString(value) {
  const text = String(value || '').trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return ''
  const time = new Date(text + 'T00:00:00').getTime()
  return Number.isNaN(time) ? '' : text
}
function formatServiceHistoryDate(value) {
  const date = validDateString(value)
  return date ? formatDateWithDay(date) : '날짜 미등록'
}
function serviceHistoryAmount(value) {
  if (value === undefined || value === null || value === '') return ''
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : ''
}
function formatServiceHistoryAmount(value) {
  const amount = serviceHistoryAmount(value)
  return amount === '' ? '-' : currency(amount)
}
function cleanHistoryText(value, fallback = '-') {
  const text = String(value ?? '').trim()
  if (!text || text === 'undefined' || text === 'null' || text === 'NaN') return fallback
  return text
}
function historyCustomerMatcher(customerOrPhone) {
  const customer = typeof customerOrPhone === 'object' && customerOrPhone ? customerOrPhone : { phone: customerOrPhone }
  const targetId = cleanHistoryText(customer.customerId || customer.id, '')
  const targetPhone = phoneDigits(customer.phone || customer.ownerPhone || customer.guardianPhone || '')
  const targetOwner = cleanHistoryText(customer.guardianName || customer.ownerName || customer.customerName, '')
  const targetPet = cleanHistoryText(customer.dogName || customer.name || customer.petName, '')
  return (item = {}) => {
    const itemId = cleanHistoryText(item.customerId || item.customerID, '')
    if (targetId && itemId && targetId === itemId) return true
    const itemPhone = phoneDigits(item.phone || item.ownerPhone || item.guardianPhone || '')
    if (targetPhone && itemPhone && targetPhone === itemPhone) return true
    const itemOwner = cleanHistoryText(item.guardianName || item.ownerName || item.customerName || item.customerVendor, '')
    const itemPet = cleanHistoryText(item.dogName || item.name || item.petName, '')
    if (targetOwner && targetPet && itemOwner === targetOwner && itemPet === targetPet) return true
    if (targetOwner && targetPet && itemOwner.includes(targetOwner) && cleanHistoryText(item.title || item.memo || '', '').includes(targetPet)) return true
    return false
  }
}
function normalizeServiceHistoryRow(row, index) {
  const normalized = {
    id: cleanHistoryText(row.id, 'history-row-' + index),
    date: validDateString(row.date),
    type: cleanHistoryText(row.type, '기타'),
    service: cleanHistoryText(row.service),
    petName: cleanHistoryText(row.petName),
    ownerName: cleanHistoryText(row.ownerName, '보호자 미등록'),
    staff: cleanHistoryText(row.staff),
    amount: serviceHistoryAmount(row.amount),
    status: cleanHistoryText(row.status),
    memo: cleanHistoryText(row.memo),
  }
  normalized.detail = {
    date: formatServiceHistoryDate(normalized.date),
    type: normalized.type,
    petName: normalized.petName,
    ownerName: normalized.ownerName,
    service: normalized.service,
    staff: normalized.staff,
    amount: normalized.amount,
    status: normalized.status,
    memo: normalized.memo,
  }
  return normalized
}
function sortServiceHistory(rows) {
  return [...rows].sort((a, b) => {
    const left = a.date ? new Date(a.date + 'T00:00:00').getTime() : Number.NEGATIVE_INFINITY
    const right = b.date ? new Date(b.date + 'T00:00:00').getTime() : Number.NEGATIVE_INFINITY
    return right - left
  })
}
function buildCustomerServiceHistory(data, customerOrPhone) {
  let hasError = false
  const rows = []
  try {
    const matchesCustomer = historyCustomerMatcher(customerOrPhone)
    const groomingSource = Array.isArray(data?.groomingReservations) ? data.groomingReservations : []
    const adoptionSource = Array.isArray(data?.adoptionConsultations) ? data.adoptionConsultations : []
    const puppySource = Array.isArray(data?.puppies) ? data.puppies : []
    const accountingSource = Array.isArray(data?.accountingEntries) ? data.accountingEntries : []
    const pushSafe = (sourceRows, mapper) => {
      sourceRows.forEach((item) => {
        try {
          if (matchesCustomer(item)) rows.push(mapper(item))
        } catch (error) {
          hasError = true
          console.error('Customer service history row skipped', error, item)
        }
      })
    }

    pushSafe(groomingSource, (item) => ({
      id: 'history-grooming-' + cleanHistoryText(item.id, Date.now()),
      date: item.date,
      type: '미용/케어',
      service: [item.serviceType, item.options && item.options !== '없음' ? item.options : null].filter(Boolean).join(' · '),
      petName: item.dogName || item.name,
      ownerName: item.guardianName || item.ownerName,
      staff: item.staff,
      amount: item.price,
      status: item.paymentStatus || item.status,
      memo: item.specialNote || item.memo,
    }))

    pushSafe(adoptionSource, (item) => ({
      id: 'history-adoption-' + cleanHistoryText(item.id, Date.now()),
      date: item.completedDate || item.date,
      type: item.status === '입양완료' || item.status === '분양완료' ? '입양' : '상담',
      service: item.breed ? item.breed + ' 퍼피 매칭' : '퍼피 매칭',
      petName: item.dogName || item.name,
      ownerName: item.guardianName || item.ownerName,
      staff: replaceRole(item.consultant || item.staff),
      amount: item.price || item.finalPrice || item.adoptionPrice,
      status: item.status === '분양완료' ? '입양완료' : item.status,
      memo: item.specialNote || item.memo,
    }))

    pushSafe(puppySource.filter((item) => ['입양완료', '분양완료'].includes(item.status)), (item) => ({
      id: 'history-puppy-' + cleanHistoryText(item.id, Date.now()),
      date: item.completedDate || item.date || item.arrival,
      type: '입양',
      service: item.breed ? item.breed + ' 입양완료' : '퍼피 입양완료',
      petName: item.dogName || item.name,
      ownerName: item.guardianName || item.ownerName,
      staff: replaceRole(item.consultant || item.staff),
      amount: item.finalPrice || item.adoptionPrice,
      status: '입양완료',
      memo: item.specialNote || item.memo,
    }))

    pushSafe(accountingSource, (item) => ({
      id: 'history-accounting-' + cleanHistoryText(item.id, Date.now()),
      date: item.date,
      type: item.type || '회계',
      service: item.title || item.category || '회계 반영',
      petName: item.dogName || item.name,
      ownerName: item.guardianName || item.ownerName || item.customerVendor,
      staff: item.staff,
      amount: item.amount,
      status: item.status,
      memo: item.memo,
    }))
  } catch (error) {
    hasError = true
    console.error('Customer service history failed', error)
  }
  return { rows: sortServiceHistory(rows.map(normalizeServiceHistoryRow)), hasError }
}
function sumAmount(rows, filter) {
  return rows.filter(filter).reduce((sum, item) => sum + Number(item.amount || 0), 0)
}
function sumSettlement(rows, filter, key = 'settlementAmount') {
  return rows.filter(filter).reduce((sum, item) => sum + Number(item[key] || 0), 0)
}
function App() {
  const [activeTab, setActiveTab] = useState('메인')
  const [loginUser, setLoginUser] = useState(loadLoginUser)
  const [data, setData] = useState(loadData)
  const [modal, setModal] = useState(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [adoptionMenu, setAdoptionMenu] = useState(adoptionMenus[0])
  const [groomingFilters, setGroomingFilters] = useState({ staff: '전체', status: '전체', from: '2026-05-01', to: '2026-05-31', query: '' })
  const [customerPhone, setCustomerPhone] = useState('010-1234-1001')
  const [customerFilter, setCustomerFilter] = useState('전체')
  const [customerQuery, setCustomerQuery] = useState('')
  const [customerMemos, setCustomerMemos] = useState(loadCustomerMemos)
  const [deletedCustomerPhones, setDeletedCustomerPhones] = useState(loadDeletedCustomerPhones)
  const [groomingForm, setGroomingForm] = useState(defaultGroomingForm)
  const [supplyForm, setSupplyForm] = useState(defaultSupplyForm)
  const [accountingForm, setAccountingForm] = useState(defaultAccountingForm)
  const [settlementFilters, setSettlementFilters] = useState({ from: '2026-05-01', to: '2026-05-31', unpaidOnly: false })
  const [accountingTab, setAccountingTab] = useState(accountingTabs[0])
  const [supabaseLoaded, setSupabaseLoaded] = useState(false)
  const visibleTabs = useMemo(() => isAdmin(loginUser) ? tabs : tabs.filter((tab) => !isRestrictedTab(tab)), [loginUser])

  useEffect(() => {
    let mounted = true
    const localBackup = loadData()
    const shouldUploadLocalBackup = hasLocalDashboardBackup()
    loadSupabaseDashboardData()
      .then((remoteData) => {
        if (!mounted) return
        if (shouldUploadLocalBackup) {
          setData(syncDerivedData(localBackup))
          return
        }
        if (remoteData) setData(syncDerivedData(remoteData))
      })
      .catch((error) => {
        console.error('Supabase 데이터 불러오기 실패, localStorage 백업을 사용합니다.', error)
      })
      .finally(() => {
        if (mounted) setSupabaseLoaded(true)
      })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const normalized = normalizeLoginSession(loginUser)
    if (loginUser && normalized && (loginUser.id !== normalized.id || loginUser.role !== normalized.role || loginUser.name !== normalized.name)) {
      localStorage.setItem(LOGIN_KEY, JSON.stringify(normalized))
      setLoginUser(normalized)
    }
  }, [loginUser])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    localStorage.setItem('groomingReservations', JSON.stringify(data.groomingReservations))
    localStorage.setItem('adoptionConsultations', JSON.stringify(data.adoptionConsultations))
    localStorage.setItem('puppies', JSON.stringify(data.puppies))
    localStorage.setItem('supplyPurchases', JSON.stringify(data.supplyPurchases))
    localStorage.setItem('accountingEntries', JSON.stringify(data.accountingEntries))
    localStorage.setItem('settlementEntries', JSON.stringify(data.settlementEntries))
  }, [data])

  useEffect(() => {
    localStorage.setItem('customerMemos', JSON.stringify(customerMemos))
  }, [customerMemos])

  useEffect(() => {
    localStorage.setItem('deletedCustomerPhones', JSON.stringify(deletedCustomerPhones))
  }, [deletedCustomerPhones])

  function commit(updater) {
    setData((prev) => syncDerivedData(typeof updater === 'function' ? updater(prev) : updater))
  }

  const activeGroomingReservations = data.groomingReservations.filter((item) => !isCanceledGrooming(item))
  const todayGrooming = sortByDateTime(activeGroomingReservations.filter((item) => item.date === today))
  const todayAdoptions = sortByDateTime(data.adoptionConsultations.filter((item) => item.date === today))
  const attentionItems = [...data.groomingReservations, ...data.adoptionConsultations].filter((item) => item.date === today && item.status === '확인필요')
  const calendarDays = monthDays(currentMonth, activeGroomingReservations, data.adoptionConsultations)
  const rawCustomers = useMemo(() => buildCustomers(data), [data])
  const customers = useMemo(() => rawCustomers.filter((customer) => !deletedCustomerPhones.includes(phoneDigits(customer.phone))), [rawCustomers, deletedCustomerPhones])

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers))
  }, [customers])

  useEffect(() => {
    if (!supabaseLoaded) return undefined
    const timer = window.setTimeout(() => {
      syncDashboardToSupabase(data, customers).catch((error) => {
        console.error('Supabase 저장 실패, localStorage 백업을 유지합니다.', error)
      })
    }, 400)
    return () => window.clearTimeout(timer)
  }, [data, customers, supabaseLoaded])

  const selectedCustomer = useMemo(() => customers.find((item) => item.phone === customerPhone) || customers[0] || null, [customerPhone, customers])
  const selectedCustomerHistory = useMemo(() => buildCustomerServiceHistory(data, selectedCustomer || { phone: customerPhone }), [selectedCustomer, customerPhone, data])
  const filteredGrooming = sortByDateTime(data.groomingReservations.filter((item) => {
    const query = groomingFilters.query.trim()
    const keywordOk = matchesSearch([item.dogName, item.guardianName, item.phone, item.breed, item.serviceType], query)
    return keywordOk && (groomingFilters.staff === '전체' || item.staff === groomingFilters.staff) && (groomingFilters.status === '전체' || item.status === groomingFilters.status) && (!groomingFilters.from || item.date >= groomingFilters.from) && (!groomingFilters.to || item.date <= groomingFilters.to)
  }))

  const todayIncome = sumAmount(data.accountingEntries, (item) => item.date === today && item.type === '수익')
  const todayExpense = sumAmount(data.accountingEntries, (item) => item.date === today && item.type === '비용')
  const monthIncome = sumAmount(data.accountingEntries, (item) => item.date.startsWith(currentMonth) && item.type === '수익')
  const monthExpense = sumAmount(data.accountingEntries, (item) => item.date.startsWith(currentMonth) && item.type === '비용')
  const todayYesulSales = sumSettlement(data.settlementEntries, (item) => item.date === today, 'salesAmount')
  const todayYesulSettlement = sumSettlement(data.settlementEntries, (item) => item.date === today)
  const monthYesulSales = sumSettlement(data.settlementEntries, (item) => item.date.startsWith(currentMonth), 'salesAmount')
  const monthYesulSettlement = sumSettlement(data.settlementEntries, (item) => item.date.startsWith(currentMonth))
  const filteredSettlements = data.settlementEntries.filter((item) => (!settlementFilters.from || item.date >= settlementFilters.from) && (!settlementFilters.to || item.date <= settlementFilters.to) && (!settlementFilters.unpaidOnly || item.status !== '정산완료'))

  function createGrooming(reservation) {
    const normalized = toGrooming({ ...reservation, id: reservation.id || `g-${Date.now()}` })
    commit((prev) => ({ ...prev, groomingReservations: [normalized, ...prev.groomingReservations] }))
    setModal(null)
  }
  function addGrooming(event) {
    event.preventDefault()
    createGrooming(groomingForm)
    setGroomingForm(defaultGroomingForm())
  }
  function saveGrooming(next) {
    const normalized = toGrooming(next)
    commit((prev) => ({ ...prev, groomingReservations: prev.groomingReservations.map((item) => item.id === normalized.id ? normalized : item) }))
    setModal(null)
  }
  function deleteGrooming(id) {
    if (!window.confirm('이 예약을 삭제하시겠습니까?')) return
    commit((prev) => ({ ...prev, groomingReservations: prev.groomingReservations.filter((item) => item.id !== id) }))
    setModal(null)
  }
  function addSupply(event) {
    event.preventDefault()
    const purchase = toSupply({ ...supplyForm, id: `s-${Date.now()}` })
    commit((prev) => ({ ...prev, supplyPurchases: [purchase, ...prev.supplyPurchases] }))
    setSupplyForm(defaultSupplyForm())
  }
  function saveSupply(next) {
    const normalized = toSupply(next)
    commit((prev) => ({ ...prev, supplyPurchases: prev.supplyPurchases.map((item) => item.id === normalized.id ? normalized : item) }))
    setModal(null)
  }
  function deleteSupply(itemOrId) {
    if (!isAdmin(loginUser)) {
      window.alert('삭제는 관리자만 가능합니다.')
      return
    }
    const id = typeof itemOrId === 'object' ? itemOrId.id : itemOrId
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    commit((prev) => ({ ...prev, supplyPurchases: prev.supplyPurchases.filter((item) => item.id !== id) }))
    setModal(null)
  }
  function addAccounting(event) {
    event.preventDefault()
    const entry = toAccounting({ ...accountingForm, id: `acc-manual-${Date.now()}`, sourceId: `manual-${Date.now()}` })
    commit((prev) => ({ ...prev, accountingEntries: [entry, ...prev.accountingEntries] }))
    setAccountingForm(defaultAccountingForm())
  }
  function saveAccounting(next) {
    const normalized = toAccounting(next)
    commit((prev) => ({ ...prev, accountingEntries: prev.accountingEntries.map((item) => item.id === normalized.id ? normalized : item) }))
    setModal(null)
  }
  function setAccountingStatus(id, status) {
    commit((prev) => ({ ...prev, accountingEntries: prev.accountingEntries.map((item) => item.id === id ? { ...item, status } : item) }))
    setModal(null)
  }
  function setAccountingSettlement(id, status) {
    commit((prev) => ({ ...prev, accountingEntries: prev.accountingEntries.map((item) => item.id === id ? { ...item, settlementStatus: status } : item), settlementEntries: prev.settlementEntries.map((item) => `acc-grooming-${item.groomingId}` === id ? { ...item, status } : item) }))
    setModal(null)
  }
  function completeAdoption(item) {
    const completed = { ...toAdoption(item), status: '입양완료' }
    commit((prev) => ({ ...prev, adoptionConsultations: prev.adoptionConsultations.map((adoption) => adoption.id === completed.id ? completed : adoption) }))
    setModal({ type: 'edit-adoption', title: '입양완료 처리', item: completed })
  }
  function saveAdoption(next) {
    const normalized = toAdoption(next)
    commit((prev) => ({ ...prev, adoptionConsultations: prev.adoptionConsultations.map((item) => item.id === normalized.id ? normalized : item) }))
    setModal(null)
  }
  function deleteAdoption(item) {
    const hasAccounting = data.accountingEntries.some((entry) => entry.sourceId === item.id || String(entry.sourceId || '').includes(item.id)) || ['입양완료', '분양완료'].includes(item.status)
    const message = hasAccounting ? '회계장부에 반영된 데이터일 수 있습니다. 삭제하시겠습니까?' : '해당 데이터를 삭제하시겠습니까?'
    if (!window.confirm(message)) return
    commit((prev) => ({ ...prev, adoptionConsultations: prev.adoptionConsultations.filter((row) => row.id !== item.id) }))
    setModal(null)
  }
  function savePuppy(next) {
    const normalized = toPuppy(next)
    commit((prev) => {
      const puppies = prev.puppies.map((item) => item.id === normalized.id ? normalized : item)
      const adoptionId = 'adopt-' + (normalized.profileNo || normalized.id)
      const adoptionRow = adoptionFromPuppy(normalized)
      const adoptionConsultations = isAdoptedPuppy(normalized)
        ? prev.adoptionConsultations.some((item) => item.id === adoptionId)
          ? prev.adoptionConsultations.map((item) => item.id === adoptionId ? adoptionRow : item)
          : [adoptionRow, ...prev.adoptionConsultations]
        : prev.adoptionConsultations
      return { ...prev, puppies, adoptionConsultations }
    })
    setModal(null)
  }
  function addPuppy(next) {
    const normalized = toPuppy({ ...next, id: 'p-' + Date.now(), profileNo: next.profileNo || 'P-' + Date.now() })
    commit((prev) => ({ ...prev, puppies: [normalized, ...prev.puppies] }))
    setModal(null)
  }
  function deletePuppy(itemOrId) {
    const target = typeof itemOrId === 'object' ? itemOrId : data.puppies.find((item) => item.id === itemOrId)
    const message = target && ['입양완료', '분양완료'].includes(target.status) ? '회계장부에 반영된 데이터일 수 있습니다. 삭제하시겠습니까?' : '해당 데이터를 삭제하시겠습니까?'
    if (!window.confirm(message)) return
    commit((prev) => ({ ...prev, puppies: prev.puppies.filter((item) => item.id !== (target?.id || itemOrId)) }))
    setModal(null)
  }
  function completePuppyAdoption(next) {
    if (!window.confirm('입양완료 처리하면 퍼피 프로파일 목록에서 사라지고 퍼피 입양 관리 내역으로 이동됩니다. 계속하시겠습니까?')) return
    const normalized = toPuppy({ ...next, status: '입양완료', completedDate: next.completedDate || today })
    savePuppy(normalized)
  }
  function saveSettlement(next) {
    commit((prev) => ({ ...prev, settlementEntries: prev.settlementEntries.map((item) => item.id === next.id ? { ...next, salesAmount: Number(next.salesAmount), settlementAmount: Number(next.settlementAmount) } : item) }))
    setModal(null)
  }
  function setSettlementStatus(id, status) {
    commit((prev) => ({ ...prev, settlementEntries: prev.settlementEntries.map((item) => item.id === id ? { ...item, status } : item), accountingEntries: prev.accountingEntries.map((item) => item.id === id.replace('set-', 'acc-grooming-') ? { ...item, settlementStatus: status } : item) }))
    setModal(null)
  }
  function deleteCustomer(customer) {
    if (!isAdmin(loginUser)) {
      window.alert('삭제는 관리자만 가능합니다.')
      return
    }
    if (!customer?.phone) return
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    const phoneKey = phoneDigits(customer.phone)
    setDeletedCustomerPhones((prev) => Array.from(new Set([...prev, phoneKey])))
    setCustomerMemos((prev) => {
      const next = { ...prev }
      delete next[customer.phone]
      delete next[phoneKey]
      return next
    })
    if (phoneDigits(customerPhone) === phoneKey) setCustomerPhone('')
  }
  function chooseExistingCustomer(customer) {
    const latest = data.groomingReservations.find((item) => item.phone === customer.phone) || customer
    setGroomingForm((prev) => ({ ...prev, customerType: '기존 고객', dogName: latest.dogName || '', breed: latest.breed || '시츄', guardianName: customer.guardianName, phone: customer.phone, serviceType: latest.serviceType || prev.serviceType, options: latest.options || prev.options, price: latest.price || prev.price }))
    setModal(null)
  }

  if (!loginUser) return <LoginScreen onLogin={setLoginUser} />
  const restricted = isRestrictedTab(activeTab) && !isAdmin(loginUser)

  return <main className="appShell"><aside className="sidebar"><Brand /><nav className="tabs" aria-label="업무 탭">{visibleTabs.map((tab) => <button className={activeTab === tab ? 'active' : ''} key={tab} type="button" onClick={() => setActiveTab(tab)}>{tab}</button>)}</nav></aside><section className="page"><header className="pageHeader"><div><p className="kicker">LOCAL STORAGE · 자동 저장</p><h1>{activeTab}</h1></div><div className="headerTools"><div className="headerPill">현재 사용자: {loginUser.name}</div><button type="button" onClick={() => { localStorage.removeItem(LOGIN_KEY); setLoginUser(null) }}>로그아웃</button></div></header>{restricted && <AccessDenied />}{!restricted && activeTab === '메인' && <MainTab todayGrooming={todayGrooming} todayAdoptions={todayAdoptions} calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen} calendarDays={calendarDays} data={data} setModal={setModal} />}{!restricted && activeTab === '미용/케어' && <GroomingTab form={groomingForm} setForm={setGroomingForm} addGrooming={addGrooming} filters={groomingFilters} setFilters={setGroomingFilters} rows={filteredGrooming} setModal={setModal} customers={customers} />}{!restricted && activeTab === '분양관리' && <AdoptionTab data={data} menu={adoptionMenu} setMenu={setAdoptionMenu} setModal={setModal} completeAdoption={completeAdoption} />}{!restricted && activeTab === '매장용품관리' && <SupplyTab form={supplyForm} setForm={setSupplyForm} addSupply={addSupply} supplies={data.supplyPurchases} setModal={setModal} deleteSupply={isAdmin(loginUser) ? deleteSupply : null} />}{!restricted && activeTab === '고객관리' && <CustomerTab customers={customers} selectedCustomer={selectedCustomer} phone={customerPhone} setPhone={setCustomerPhone} history={selectedCustomerHistory} setModal={setModal} filter={customerFilter} setFilter={setCustomerFilter} query={customerQuery} setQuery={setCustomerQuery} customerMemos={customerMemos} setCustomerMemos={setCustomerMemos} deleteCustomer={isAdmin(loginUser) ? deleteCustomer : null} />}{!restricted && activeTab === '회계/비용장부' && isAdmin(loginUser) && <LedgerTab activeTab={accountingTab} setActiveTab={setAccountingTab} form={accountingForm} setForm={setAccountingForm} addAccounting={addAccounting} entries={data.accountingEntries} settlements={filteredSettlements} receipts={data.accountingEntries.filter((item) => item.receiptAttached || item.receiptName)} todayIncome={todayIncome} todayExpense={todayExpense} monthIncome={monthIncome} monthExpense={monthExpense} todayYesulSales={todayYesulSales} todayYesulSettlement={todayYesulSettlement} monthYesulSales={monthYesulSales} monthYesulSettlement={monthYesulSettlement} filters={settlementFilters} setFilters={setSettlementFilters} setModal={setModal} />}{!restricted && activeTab === '통합데이터' && isAdmin(loginUser) && <StatsTab data={data} />}</section>{modal && <Modal modal={modal} onClose={() => setModal(null)} saveGrooming={saveGrooming} saveAdoption={saveAdoption} savePuppy={savePuppy} addPuppy={addPuppy} deletePuppy={deletePuppy} completePuppyAdoption={completePuppyAdoption} saveSupply={saveSupply} saveAccounting={saveAccounting} saveSettlement={saveSettlement} completeAdoption={completeAdoption} chooseExistingCustomer={chooseExistingCustomer} createGrooming={createGrooming} setAccountingStatus={setAccountingStatus} setAccountingSettlement={setAccountingSettlement} setSettlementStatus={setSettlementStatus} deleteGrooming={deleteGrooming} deleteAdoption={deleteAdoption} deleteSupply={isAdmin(loginUser) ? deleteSupply : null} />}</main>
}
function roleLabel(role) {
  return { admin: '관리자', user: '사용자' }[role] || role
}
function LoginScreen({ onLogin }) {
  const [userId, setUserId] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const selected = AUTH_USERS.find((user) => user.id === userId) || AUTH_USERS[0]
  function submit(event) {
    event.preventDefault()
    if (selected.password !== password) {
      setError('비밀번호가 올바르지 않습니다.')
      return
    }
    const session = { id: selected.id, name: selected.name, role: selected.role }
    localStorage.setItem(LOGIN_KEY, JSON.stringify(session))
    onLogin(session)
  }
  return <main className="loginScreen"><form className="loginCard" onSubmit={submit}><Brand /><h1>업무 대시보드 로그인</h1><label><span>계정</span><select value={userId} onChange={(event) => { setUserId(event.target.value); setError('') }}>{AUTH_USERS.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label><label><span>비밀번호</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="0505" /></label>{error && <p className="loginError">{error}</p>}<button className="primaryAction" type="submit">로그인</button><p className="loginHint">관리자: 0505 · 사용자: 0505</p></form></main>
}
function AccessDenied() {
  return <section className="panel accessDenied"><h2>관리자만 접근 가능한 메뉴입니다.</h2></section>
}
function Brand() {
  return <div className="brandBlock"><svg className="brandSun" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="13" /><path d="M32 4v11M32 49v11M4 32h11M49 32h11M12.2 12.2l7.8 7.8M44 44l7.8 7.8M51.8 12.2 44 20M20 44l-7.8 7.8" /></svg><div className="brandText"><strong>해바라기</strong><span>퍼피하우스</span></div></div>
}
function staffClass(staff) {
  return staff === '예슬님' ? 'yesul' : 'director'
}
function MainTab({ todayGrooming, todayAdoptions, calendarOpen, setCalendarOpen, calendarDays, data, setModal }) {
  const cards = [['오늘 미용/케어 예약 건수', todayGrooming.length, todayGrooming], ['오늘 입양상담 건수', todayAdoptions.length, todayAdoptions]]
  return <div className="stack"><section className="metricGrid mainTwo">{cards.map(([label, value, list]) => <button className="summaryCard" type="button" key={label} onClick={() => setModal({ type: 'list', title: label, list })}><span>{label}</span><strong>{value}</strong><em>상세 보기</em></button>)}</section><ReservationAlert reservations={data.groomingReservations} setModal={setModal} /><section className="peopleGrid"><PersonSchedule title="원장님 오늘 예약현황" rows={sortByDateTime(todayGrooming.filter((item) => item.staff === '원장님'))} setModal={setModal} /><PersonSchedule title="예슬님 오늘 예약현황" rows={sortByDateTime(todayGrooming.filter((item) => item.staff === '예슬님'))} setModal={setModal} /><PersonSchedule title="퍼피 컨설턴트 업무내용" rows={todayAdoptions} setModal={setModal} /></section><section className="panel calendarPanel"><div className="panelTitle"><h2>월별 예약 달력</h2><button type="button" onClick={() => setCalendarOpen((value) => !value)}>{calendarOpen ? '접기' : '펼치기'}</button></div>{calendarOpen && <div className="calendarGrid">{calendarDays.map((day) => day.blank ? <div className="calendarBlank" key={day.key} /> : <button className="calendarDay" type="button" key={day.key} onClick={() => setModal({ type: 'list', title: formatDateWithDay(day.date) + ' 예약내용', list: sortByDateTime([...data.groomingReservations.filter((item) => item.date === day.date && !isCanceledGrooming(item)), ...data.adoptionConsultations.filter((item) => item.date === day.date)]) })}><strong>{day.label}</strong>{day.entries.slice(0, 4).map((item) => <span className={'calItem ' + staffClass(item.staff)} key={item.id}>{item.time || '상담'} · {item.staff || item.consultant}</span>)}{day.entries.length > 4 && <small>외 {day.entries.length - 4}건</small>}</button>)}</div>}</section></div>
}
function ReservationAlert({ reservations, setModal }) {
  const tomorrow = dateOffset(today, 1)
  const todayRows = sortByDateTime((reservations || []).filter(isUpcomingTodayReservation))
  const tomorrowRows = sortByDateTime((reservations || []).filter((item) => item.date === tomorrow && !isCanceledGrooming(item)))
  const renderRows = (rows, emptyText) => rows.length === 0 ? <p className="reservationAlertEmpty">{emptyText}</p> : <div className="reservationAlertList">{rows.map((item) => <button className={'reservationAlertItem ' + staffClass(item.staff) + (isWithinThirtyMinutes(item) ? ' urgent' : '')} key={item.id} type="button" onClick={() => setModal({ type: 'edit-grooming', title: petLabel(item), item })}><div><strong>{item.time || '-'}</strong><span>{petLabel(item)} · {item.serviceType || '-'}</span></div><em className={'staffBadge ' + staffClass(item.staff)}>{item.staff || '-'}</em>{isWithinThirtyMinutes(item) && <b>30분 이내</b>}</button>)}</div>
  return <section className="panel reservationAlertPanel"><div className="panelTitle"><h2>예약 알림</h2><span>Supabase 예약 데이터 기준</span></div><div className="reservationAlertGrid"><article><h3>오늘 남은 예약</h3>{renderRows(todayRows, '오늘 남은 예약이 없습니다.')}</article><article><h3>내일 예약</h3>{renderRows(tomorrowRows, '내일 예약이 없습니다.')}</article></div></section>
}
function PersonSchedule({ title, rows, setModal }) {
  const sortedRows = sortByDateTime(rows)
  return <article className="panel"><div className="panelTitle"><h2>{title}</h2><span>{rows.length}건</span></div><div className="miniList">{sortedRows.slice(0, 3).map((item) => <button key={item.id} type="button" onClick={() => setModal({ type: item.consultant ? 'edit-adoption' : 'edit-grooming', title: petLabel(item), item })}><strong>{petLabel(item)}</strong><span>{formatDateWithDay(item.date)} · {item.time || item.status} · {item.serviceType || item.memo}</span></button>)}{sortedRows.length > 3 && <button className="moreButton" type="button" onClick={() => setModal({ type: 'list', title, list: sortedRows })}>나머지 {sortedRows.length - 3}건 보기</button>}</div></article>
}
function GroomingTab({ filters, setFilters, rows, setModal, customers }) {
  return <div className="stack"><section className="panel compactToolbar"><div><h2>미용/케어 예약</h2><p>예약등록 버튼으로 신규/기존 고객 선택 후 예약을 등록합니다.</p></div><button className="largeAction" type="button" onClick={() => setModal({ type: 'booking', title: '예약등록', customers })}>예약등록</button></section><section className="panel reservationPanel"><div className="panelTitle"><h2>예약현황</h2><span>행 클릭 시 상세/수정</span></div><div className="filterBar"><Input label="검색" value={filters.query} onChange={(value) => setFilters({ ...filters, query: value })} /><Input label="시작일" type="date" value={filters.from} onChange={(value) => setFilters({ ...filters, from: value })} /><Input label="종료일" type="date" value={filters.to} onChange={(value) => setFilters({ ...filters, to: value })} /><Select label="담당자" value={filters.staff} onChange={(value) => setFilters({ ...filters, staff: value })} options={['전체', ...staffList]} /><Select label="진행상태" value={filters.status} onChange={(value) => setFilters({ ...filters, status: value })} options={['전체', ...statusList]} /></div><DataTable rows={rows} columns={['dogName', 'breed', 'guardianName', 'phone', 'date', 'time', 'serviceType', 'options', 'price', 'staff', 'status', 'paymentStatus']} type="edit-grooming" setModal={setModal} /></section></div>
}
function completedAdoptionRows(data) {
  return data.puppies.filter(isAdoptedPuppy).map((puppy) => ({
    ...puppy,
    dogName: puppy.name || puppy.dogName || '',
    completedDate: puppy.completedDate || today,
    finalPrice: puppy.adoptionPrice || puppy.finalPrice || 0,
    specialNote: puppy.specialNote || puppy.memo || '',
  }))
}
function AdoptionTab({ data, menu, setMenu, setModal, completeAdoption }) {
  const profileRows = activePuppyRows(data.puppies)
  const adoptedRows = completedAdoptionRows(data)
  const rows = menu === adoptionMenus[0] ? data.adoptionConsultations : menu === adoptionMenus[1] ? profileRows : adoptedRows
  const columns = menu === adoptionMenus[0] ? ['dogName', 'breed', 'guardianName', 'status', 'consultant'] : menu === adoptionMenus[1] ? ['name', 'breed', 'gender', 'ageMonths', 'arrival', 'intakeAmount', 'adoptionPrice', 'status', 'consultant'] : ['dogName', 'breed', 'gender', 'ageMonths', 'arrival', 'completedDate', 'finalPrice', 'guardianName', 'phone', 'consultant']
  const tableClass = menu === adoptionMenus[1] ? 'puppyProfilePanel' : menu === adoptionMenus[2] ? 'puppyAdoptionPanel' : ''
  return <div className="stack"><div className="subTabs">{adoptionMenus.map((item) => <button className={menu === item ? 'active' : ''} key={item} type="button" onClick={() => setMenu(item)}>{item}</button>)}</div>{menu === adoptionMenus[1] && <section className="panel compactToolbar"><div><h2>퍼피 프로파일</h2><p>신규 등록, 수정, 삭제, 입양완료 처리를 관리합니다.</p></div><button className="largeAction" type="button" onClick={() => setModal({ type: 'new-puppy', title: '신규 퍼피 등록', item: { status: '입소', breed: '시츄', consultant: '퍼피 컨설턴트' } })}>신규 퍼피 등록</button></section>}<section className={`panel compactPanel ${tableClass}`}><div className="panelTitle"><h2>{menu}</h2><span>행 클릭 시 팝업</span></div><DataTable rows={rows} columns={columns} type={menu === adoptionMenus[0] ? 'edit-adoption' : 'edit-puppy'} setModal={setModal} extraAction={completeAdoption} /></section></div>
}
function SupplyTab({ form, setForm, addSupply, supplies, setModal, deleteSupply }) {
  return <div className="stack"><form className="panel formGrid" onSubmit={addSupply}><div className="panelTitle wide"><h2>거래처/대리점 총매입가 등록</h2><span>개별 상품 재고관리 없음</span></div><Input label="매입일" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} /><Input label="거래처" value={form.vendor} onChange={(value) => setForm({ ...form, vendor: value })} /><Select label="품목구분" value={form.itemType} onChange={(value) => setForm({ ...form, itemType: value })} options={itemTypes} /><Input label="매입내용" value={form.summary} onChange={(value) => setForm({ ...form, summary: value })} /><Input label="총매입금액" type="number" value={form.totalAmount} onChange={(value) => setForm({ ...form, totalAmount: value })} /><Input label="결제수단" value={form.paymentMethod} onChange={(value) => setForm({ ...form, paymentMethod: value })} /><Select label="처리상태" value={form.status} onChange={(value) => setForm({ ...form, status: value })} options={processStatusList} /><ReceiptInput label="영수증 첨부" onChange={(fileName) => setForm({ ...form, receiptAttached: Boolean(fileName), receiptName: fileName })} /><button className="primaryAction" type="submit">매입 등록</button></form><section className="panel"><DataTable rows={supplies} columns={['date', 'vendor', 'itemType', 'totalAmount', 'status']} type="edit-supply" setModal={setModal} onDelete={deleteSupply} /></section></div>
}
function CustomerTab({ customers, selectedCustomer, phone, setPhone, history, setModal, filter, setFilter, query, setQuery, customerMemos, setCustomerMemos, deleteCustomer }) {
  const historyRows = Array.isArray(history) ? history : (history?.rows || [])
  const historyHasError = Boolean(history?.hasError)
  const filterOptions = ['전체', '신규', '재방문', '단골', 'VIP', '미용고객', '입양고객']
  const keyword = query.trim().toLowerCase()
  const filteredCustomers = customers.filter((customer) => {
    const filterOk = filter === '전체' || customer.badges.includes(filter)
    const queryOk = matchesSearch([customer.guardianName, customer.phone, customer.dogName, customer.breed], query)
    return filterOk && queryOk
  })
  const activeCustomer = selectedCustomer || filteredCustomers[0] || null
  const memoKey = activeCustomer?.phone || ''
  const memo = customerMemos[memoKey] || { important: '', caution: '' }
  const updateMemo = (key, value) => {
    if (!memoKey) return
    setCustomerMemos((prev) => ({ ...prev, [memoKey]: { ...(prev[memoKey] || {}), [key]: value } }))
  }

  return <div className="customerCrmPage">
    <section className="panel crmToolbar">
      <div className="crmSearchBox"><span>고객 검색</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="보호자 · 전화번호 · 견명 · 견종" /></div>
      <div className="crmFilterTabs">{filterOptions.map((item) => <button className={filter === item ? 'active' : ''} key={item} type="button" onClick={() => setFilter(item)}>{item}</button>)}</div>
    </section>
    <div className="customerCrm">
      <section className="panel crmCustomerList">
        <div className="panelTitle"><h2>고객 목록</h2><span>{filteredCustomers.length}명</span></div>
        <div className="crmList">{filteredCustomers.map((customer) => <div className={phone === customer.phone ? 'crmListRow selected' : 'crmListRow'} key={customer.phone}>
          <button className="crmSelectButton" type="button" onClick={() => setPhone(customer.phone)}>
            <strong>{customer.guardianName || '-'}</strong>
            <span>{formatPhoneNumber(customer.phone) || '-'}</span>
            <em>견명 {customer.dogName || '-'}</em>
            <div className="badgeRow crmBadges">{customer.badges.map((badge) => <i className={badgeClass(badge)} key={badge}>{badge}</i>)}</div>
          </button>
          {deleteCustomer && <button className="rowDeleteButton" type="button" onClick={() => deleteCustomer(customer)}>삭제</button>}
        </div>)}</div>
        {filteredCustomers.length === 0 && <p className="empty">조건에 맞는 고객이 없습니다.</p>}
      </section>
      <section className="panel customerHistory crmDetailPanel">
        {activeCustomer ? <>
          <div className="crmDetailHeader">
            <div><p className="kicker">CRM CUSTOMER CARD</p><h2>{activeCustomer.guardianName}</h2></div>
            <div className="badgeRow crmBadges">{activeCustomer.badges.map((badge) => <i className={badgeClass(badge)} key={badge}>{badge}</i>)}</div>
          </div>
          <div className="crmDetailGrid">
            <InfoCard label="보호자 이름" value={activeCustomer.guardianName} />
            <InfoCard label="전화번호" value={formatPhoneNumber(activeCustomer.phone)} />
            <InfoCard label="견명" value={activeCustomer.dogName} />
            <InfoCard label="견종" value={activeCustomer.breed} />
            <InfoCard label="고객구분" value={activeCustomer.customerType} />
            <InfoCard label="최근 방문일" value={formatDateWithDay(activeCustomer.lastVisitDate)} />
            <InfoCard label="총 방문횟수" value={activeCustomer.visitCount + '회'} />
            <InfoCard label="누적 결제금액" value={currency(activeCustomer.totalPaid)} />
            <InfoCard label="특이사항" value={activeCustomer.specialNote || '-'} />
          </div>
          <div className="crmMemoGrid">
            <label><span>중요 메모</span><textarea value={memo.important || ''} onChange={(event) => updateMemo('important', event.target.value)} placeholder="예: 특정 스타일 선호, 연락 선호 시간" /></label>
            <label><span>주의사항 메모</span><textarea value={memo.caution || ''} onChange={(event) => updateMemo('caution', event.target.value)} placeholder="예: 예민함, 피부 약함, 만지기 싫어하는 부위" /></label>
          </div>
          <div className="panelTitle crmHistoryTitle"><h2>전체 서비스 이력</h2><span>행 클릭 시 상세/수정</span></div>
          <div className="tableWrap crmHistoryWrap"><table className="crmHistoryTable"><thead><tr><th>날짜</th><th>구분</th><th>견명</th><th>서비스</th><th>담당자</th><th>금액</th><th>상태</th><th>메모</th></tr></thead><tbody>{historyRows.map((row) => <tr key={row.id} onClick={() => setModal({ type: 'detail', title: '서비스 이력 상세', item: row.detail || row })}><td>{formatServiceHistoryDate(row.date)}</td><td>{row.type || '기타'}</td><td>{row.petName || '-'}</td><td>{row.service || '-'}</td><td>{row.staff || '-'}</td><td>{formatServiceHistoryAmount(row.amount)}</td><td>{row.status || '-'}</td><td>{row.memo || '-'}</td></tr>)}</tbody></table>{historyHasError && <p className="historyWarning">서비스 이력을 불러오는 중 일부 데이터 형식 오류가 있습니다.</p>}{historyRows.length === 0 && <p className="empty">서비스 이력이 없습니다.</p>}</div>
        </> : <EmptyState message="선택된 고객이 없습니다." />}
      </section>
    </div>
  </div>
}
function InfoCard({ label, value }) {
  return <div className="crmInfoCard"><span>{label}</span><strong>{value || '-'}</strong></div>
}
function badgeClass(badge) {
  return 'badge-' + String(badge).replace(/[^a-zA-Z0-9가-힣]/g, '')
}
function monthlyLedgerRows(entries) {
  const map = new Map()
  entries.forEach((item) => {
    const month = item.date.slice(0, 7)
    const current = map.get(month) || { id: 'month-' + month, month, income: 0, expense: 0, needsCheck: 0 }
    if (item.type === '수익') current.income += Number(item.amount || 0)
    if (item.type === '비용') current.expense += Number(item.amount || 0)
    if (item.status === '확인필요') current.needsCheck += 1
    map.set(month, current)
  })
  return Array.from(map.values()).sort((a, b) => b.month.localeCompare(a.month)).map((item) => ({ ...item, profit: item.income - item.expense }))
}
function isDemoAccountingEntry(item) {
  return item.sourceKind === 'manual' || ['g-2', 's-1', 's-2', 'a-3', 'manual-1'].includes(item.sourceId)
}
function LedgerTab({ activeTab, setActiveTab, entries, settlements, receipts, monthIncome, monthExpense, todayYesulSales, todayYesulSettlement, monthYesulSales, monthYesulSettlement, filters, setFilters, setModal }) {
  const monthProfit = monthIncome - monthExpense
  const todayRows = entries.filter((item) => item.date === today && !isDemoAccountingEntry(item))
  const todayIncomeView = sumAmount(todayRows, (item) => item.type === '수익')
  const todayExpenseView = sumAmount(todayRows, (item) => item.type === '비용')
  const monthlyRows = monthlyLedgerRows(entries)
  const unSettledCount = settlements.filter((item) => item.status !== '정산완료').length
  return <div className="stack accountingStack"><div className="subTabs accountingTabs">{accountingTabs.map((tab) => <button className={activeTab === tab ? 'active' : ''} key={tab} type="button" onClick={() => setActiveTab(tab)}>{tab}</button>)}</div><section className="metricGrid accountingMetrics"><button className="summaryCard static" type="button"><span>오늘 총수익</span><strong className="plusAmount">+{currency(todayIncomeView)}</strong></button><button className="summaryCard static" type="button"><span>오늘 총비용</span><strong className="minusAmount">-{currency(todayExpenseView)}</strong></button><button className="summaryCard static" type="button"><span>오늘 순이익</span><strong>{currency(todayIncomeView - todayExpenseView)}</strong></button><button className="summaryCard static" type="button"><span>월 수익</span><strong>{currency(monthIncome)}</strong></button><button className="summaryCard static" type="button"><span>월 순이익</span><strong>{currency(monthProfit)}</strong></button></section>
    {activeTab === '당일 수익·비용' && <section className="panel compactPanel"><div className="panelTitle"><h2>당일 수익·비용</h2><span>자동 반영 데이터만 표시</span></div>{todayRows.length === 0 ? <EmptyState message="오늘 등록된 수익/비용 내역이 없습니다." /> : <DataTable rows={todayRows} columns={['date', 'type', 'title', 'customerVendor', 'staff', 'amount', 'status']} type="edit-accounting" setModal={setModal} />}</section>}
    {activeTab === '월별 장부' && <section className="panel compactPanel"><div className="panelTitle"><h2>월별 장부</h2><span>월 / 총수익 / 총비용 / 순이익 / 확인필요</span></div><DataTable rows={monthlyRows} columns={['month', 'income', 'expense', 'profit', 'needsCheck']} type="detail" setModal={setModal} /></section>}
    {activeTab === '수익/비용 내역' && <section className="panel compactPanel"><div className="panelTitle"><h2>수익/비용 내역</h2><span>행 클릭 시 상세</span></div><DataTable rows={entries} columns={['date', 'type', 'title', 'amount', 'status']} type="edit-accounting" setModal={setModal} /></section>}
    {activeTab === '영수증 관리' && <section className="panel compactPanel"><div className="panelTitle"><h2>영수증 관리</h2><span>{receipts.length}건</span></div><DataTable rows={receipts} columns={['date', 'type', 'title', 'amount', 'receiptName']} type="edit-accounting" setModal={setModal} /></section>}
    {activeTab === '예슬님 정산' && <section className="panel compactPanel"><div className="panelTitle"><h2>예슬님 정산</h2><span>결제완료 미용매출 × 60%</span></div><section className="metricGrid settlementMetrics"><button className="summaryCard static" type="button"><span>오늘 예슬님 매출</span><strong>{currency(todayYesulSales)}</strong></button><button className="summaryCard static" type="button"><span>오늘 정산금액 60%</span><strong>{currency(todayYesulSettlement)}</strong></button><button className="summaryCard static" type="button"><span>이번 달 예슬님 매출</span><strong>{currency(monthYesulSales)}</strong></button><button className="summaryCard static" type="button"><span>이번 달 정산금액 60%</span><strong>{currency(monthYesulSettlement)}</strong></button><button className="summaryCard static" type="button"><span>미정산 건수</span><strong>{unSettledCount}</strong></button></section><div className="filterBar settlementFilter"><Input label="시작일" type="date" value={filters.from} onChange={(value) => setFilters({ ...filters, from: value })} /><Input label="종료일" type="date" value={filters.to} onChange={(value) => setFilters({ ...filters, to: value })} /><button type="button" onClick={() => setFilters({ ...filters, from: currentMonth + '-01', to: currentMonth + '-31' })}>이번 달 보기</button><button type="button" onClick={() => setFilters({ ...filters, unpaidOnly: !filters.unpaidOnly })}>{filters.unpaidOnly ? '전체 보기' : '미정산만 보기'}</button></div><DataTable rows={settlements} columns={['date', 'dogName', 'guardianName', 'salesAmount', 'settlementAmount', 'status']} type="edit-settlement" setModal={setModal} /></section>}
  </div>
}
function StatsTab({ data }) {
  const [filters, setFilters] = useState({ from: currentMonth + '-01', to: currentMonth + '-31', category: '전체', staff: '전체', status: '전체', query: '' })
  const rows = useMemo(() => buildStatsRows(data), [data])
  const categories = useMemo(() => ['전체', ...Array.from(new Set(rows.map((row) => row.category).filter(Boolean)))], [rows])
  const staffs = useMemo(() => ['전체', ...Array.from(new Set(rows.map((row) => row.staff).filter(Boolean)))], [rows])
  const statuses = useMemo(() => ['전체', ...Array.from(new Set(rows.map((row) => row.status).filter(Boolean)))], [rows])
  const filteredRows = rows.filter((row) => {
    const keyword = filters.query.trim()
    const queryOk = matchesSearch([row.dogName, row.guardianName, row.phone, row.breed, row.content], filters.query)
    return queryOk && (!filters.from || row.date >= filters.from) && (!filters.to || row.date <= filters.to) && (filters.category === '전체' || row.category === filters.category) && (filters.staff === '전체' || row.staff === filters.staff) && (filters.status === '전체' || row.status === filters.status)
  })
  const columns = [{ key: 'date', label: '날짜' }, { key: 'category', label: '구분' }, { key: 'dogName', label: '견명' }, { key: 'breed', label: '견종' }, { key: 'guardianName', label: '보호자 이름' }, { key: 'phone', label: '전화번호' }, { key: 'staff', label: '담당자' }, { key: 'content', label: '서비스/상담 내용' }, { key: 'status', label: '상태' }, { key: 'amount', label: '금액' }, { key: 'memo', label: '메모' }]
  const exportRows = filteredRows.map((row) => ({ ...row, date: formatDateWithDay(row.date), amount: Number(row.amount || 0) }))
  return <div className="stack statsAdmin"><section className="panel statsToolbar"><div><h2>통합데이터 로그북</h2><p>미용, 입양, 고객, 회계, 매장용품 데이터를 한곳에서 확인하는 로그북입니다.</p></div><button className="largeAction" type="button" onClick={() => downloadXlsx(exportRows, columns, '해바라기_통합데이터_' + todayStamp() + '.xlsx')}>엑셀 다운로드</button></section><section className="panel statsFilters"><Input label="시작일" type="date" value={filters.from} onChange={(value) => setFilters({ ...filters, from: value })} /><Input label="종료일" type="date" value={filters.to} onChange={(value) => setFilters({ ...filters, to: value })} /><Select label="구분" value={filters.category} onChange={(value) => setFilters({ ...filters, category: value })} options={categories} /><Select label="담당자" value={filters.staff} onChange={(value) => setFilters({ ...filters, staff: value })} options={staffs} /><Select label="상태" value={filters.status} onChange={(value) => setFilters({ ...filters, status: value })} options={statuses} /><Input label="검색" value={filters.query} onChange={(value) => setFilters({ ...filters, query: value })} /></section><section className="panel statsTablePanel"><div className="panelTitle"><h2>통합데이터</h2><span>{filteredRows.length} / {rows.length}건</span></div><div className="statsTableWrap"><table className="statsTable"><thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead><tbody>{filteredRows.map((row) => <tr key={row.id}>{columns.map((column) => <td key={column.key}>{column.key === 'date' ? formatDateWithDay(row.date) : column.key === 'amount' ? currency(row.amount) : column.key === 'phone' ? (formatPhoneNumber(row.phone) || '-') : row[column.key] || '-'}</td>)}</tr>)}</tbody></table>{filteredRows.length === 0 && <p className="empty">조건에 맞는 데이터가 없습니다.</p>}</div></section></div>
}
function EmptyState({ message }) {
  return <div className="emptyState"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 8h15l7 7v25H14z" /><path d="M29 8v8h7M19 24h12M19 30h12M19 36h8" /></svg><p>{message}</p></div>
}
function DataTable({ rows, columns, type, setModal, extraAction, onDelete }) {
  return <div className="tableWrap"><table><thead><tr>{columns.map((column) => <th key={column}>{columnLabels[column] || column}</th>)}{onDelete && <th className="actionColumn">삭제</th>}</tr></thead><tbody>{rows.map((row) => <tr key={row.id} onClick={() => setModal({ type, title: petLabel(row), item: row, extraAction })}>{columns.map((column) => <td key={column}>{displayValue(row, column)}</td>)}{onDelete && <td className="actionCell"><button className="rowDeleteButton" type="button" onClick={(event) => { event.stopPropagation(); onDelete(row) }}>삭제</button></td>}</tr>)}</tbody></table>{rows.length === 0 && <p className="empty">표시할 데이터가 없습니다.</p>}</div>
}
function formatDateWithDay(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return value || '-'
  const day = ['일', '월', '화', '수', '목', '금', '토'][new Date(value + 'T00:00:00').getDay()]
  return value + ' (' + day + ')'
}
function displayValue(row, column) {
  if (['price', 'amount', 'totalAmount', 'salesAmount', 'settlementAmount', 'income', 'expense', 'profit', 'finalPrice', 'intakeAmount', 'adoptionPrice'].includes(column)) return currency(row[column])
  if (column === 'date' || column === 'completedDate' || column === 'arrival') return formatDateWithDay(row[column])
  if (isPhoneField(column, columnLabels[column])) return formatPhoneNumber(row[column]) || '-'
  if (column === 'receiptAttached') return row.receiptAttached ? '첨부' : '미첨부'
  if (column === 'consultant') return replaceRole(row[column])
  return row[column] || '-'
}
const columnLabels = { dogName: '견명', name: '견명', petName: '견명', ownerName: '보호자', type: '구분', service: '서비스', breed: '견종', guardianName: '보호자', phone: '전화번호', date: '날짜', time: '예약시간', serviceType: '서비스유형', options: '추가옵션', price: '가격', staff: '담당자', status: '상태', paymentStatus: '결제상태', consultant: '담당자', gender: '성별', arrival: '입소일', outgoing: '출고일', vendor: '거래처', itemType: '품목구분', totalAmount: '총매입금액', type: '구분', amount: '금액', title: '항목명', customerVendor: '고객/거래처', receiptAttached: '영수증', receiptName: '영수증명', salesAmount: '미용매출', settlementAmount: '정산금액', month: '월', income: '총수익', expense: '총비용', profit: '순이익', needsCheck: '확인필요', ageMonths: '개월수', intakeAmount: '도입가', completedDate: '입양완료일', finalPrice: '입양가', specialNote: '특이사항', profileNo: '관리번호', birth: '생년월일', coatColor: '모색', source: '입소처', adoptionPrice: '입양가', healthStatus: '건강상태', vaccination: '접종정보', photoName: '사진첨부' }
function Input({ label, value, onChange, type = 'text', fieldKey = '' }) {
  const phoneField = isPhoneField(fieldKey, label)
  const display = phoneField ? formatPhoneNumber(value) : (value ?? '')
  function handleChange(event) {
    if (!phoneField) {
      onChange(event.target.value)
      return
    }
    const raw = event.target.value
    const cursor = event.target.selectionStart ?? raw.length
    const digitsBeforeCursor = phoneDigits(raw.slice(0, cursor)).length
    const formatted = formatPhoneNumber(raw)
    onChange(formatted)
    requestAnimationFrame(() => {
      let nextCursor = 0
      let seenDigits = 0
      while (nextCursor < formatted.length && seenDigits < digitsBeforeCursor) {
        if (/\\d/.test(formatted[nextCursor])) seenDigits += 1
        nextCursor += 1
      }
      try { event.target.setSelectionRange(nextCursor, nextCursor) } catch {}
    })
  }
  return <label className="field"><span>{label}</span><input type={phoneField ? 'tel' : type} inputMode={phoneField ? 'numeric' : undefined} maxLength={phoneField ? 13 : undefined} value={display} onChange={handleChange} /></label>
}
function Select({ label, value, onChange, options }) { return <label className="field"><span>{label}</span><select value={value ?? ''} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label> }
function ReceiptInput({ label, onChange }) { return <label className="field"><span>{label}</span><input type="file" onChange={(event) => onChange(event.target.files?.[0]?.name || '')} /></label> }
function Modal(props) {
  const { modal, onClose } = props
  return <div className="modalBackdrop" role="presentation" onMouseDown={onClose}><section className="modalCard" role="dialog" aria-modal="true" aria-label={modal.title} onMouseDown={(event) => event.stopPropagation()}><div className="modalHeader"><h2>{modal.title}</h2><button type="button" onClick={onClose}>닫기</button></div><ModalBody {...props} /></section></div>
}
function ModalBody({ modal, saveGrooming, saveAdoption, savePuppy, addPuppy, deletePuppy, completePuppyAdoption, saveSupply, saveAccounting, saveSettlement, completeAdoption, chooseExistingCustomer, createGrooming, setAccountingStatus, setAccountingSettlement, setSettlementStatus, deleteGrooming, deleteAdoption, deleteSupply }) {
  const [draft, setDraft] = useState(modal.item || {})
  if (modal.type === 'booking') return <BookingFlow customers={modal.customers || []} createGrooming={createGrooming} chooseExistingCustomer={chooseExistingCustomer} />
  if (modal.type === 'list') return <div className="modalList">{modal.list.length === 0 ? <p className="empty">표시할 데이터가 없습니다.</p> : sortByDateTime(modal.list).map((item) => <div className="modalLine" key={item.id}><strong>{petLabel(item)}</strong><span>{formatDateWithDay(item.date)} · {item.time || item.status} · {item.staff || item.consultant || ''}</span></div>)}</div>
  if (modal.type === 'choose-customer') return <div className="modalList">{modal.customers.map((customer) => <button className="modalLine" type="button" key={customer.phone} onClick={() => chooseExistingCustomer(customer)}><strong>{customer.guardianName} · {customer.dogName}</strong><span>{formatPhoneNumber(customer.phone)} · 기존 고객 재예약</span></button>)}</div>
  if (modal.type === 'edit-grooming') return <GroomingEditForm draft={draft} setDraft={setDraft} onSave={saveGrooming} onDelete={deleteGrooming} />
  if (modal.type === 'edit-adoption') return <EditForm draft={draft} setDraft={setDraft} fields={adoptionFields} onSave={() => saveAdoption(draft)} onDelete={() => deleteAdoption(draft)} extra={draft.status !== '입양완료' && <button className="primaryAction" type="button" onClick={() => completeAdoption(draft)}>입양완료 처리</button>} />
  if (modal.type === 'new-puppy') return <EditForm draft={draft} setDraft={setDraft} fields={puppyFields} onSave={() => addPuppy(draft)} />
  if (modal.type === 'edit-puppy') return <EditForm draft={draft} setDraft={setDraft} fields={puppyFields} onSave={() => savePuppy(draft)} onDelete={() => deletePuppy(draft)} extra={<><button className="primaryAction" type="button" onClick={() => completePuppyAdoption(draft)}>입양완료 처리</button><button className="primaryAction" type="button" onClick={() => savePuppy({ ...draft, status: '확인필요' })}>확인필요 처리</button></>} />
  if (modal.type === 'edit-supply') return <EditForm draft={draft} setDraft={setDraft} fields={supplyFields} onSave={() => saveSupply(draft)} onDelete={deleteSupply ? () => deleteSupply(draft) : null} />
  if (modal.type === 'edit-settlement') return <EditForm draft={draft} setDraft={setDraft} fields={settlementFields} onSave={() => saveSettlement(draft)} extra={<button className="primaryAction" type="button" onClick={() => setSettlementStatus(draft.id, '정산완료')}>정산완료</button>} />
  if (modal.type === 'edit-accounting') return <EditForm draft={draft} setDraft={setDraft} fields={accountingFields} onSave={() => saveAccounting(draft)} extra={<><button className="primaryAction" type="button" onClick={() => setAccountingStatus(draft.id, '처리완료')}>처리완료</button><button className="primaryAction" type="button" onClick={() => setAccountingStatus(draft.id, '확인필요')}>확인필요</button>{draft.settlementStatus !== '-' && <button className="primaryAction" type="button" onClick={() => setAccountingSettlement(draft.id, '정산완료')}>정산완료</button>}</>} />
  return <div className="detailGrid">{Object.entries(modal.item || {}).filter(([key]) => key !== 'id').map(([key, value]) => <div key={key}><dt>{columnLabels[key] || key}</dt><dd>{['price', 'amount', 'totalAmount', 'intakeAmount', 'adoptionPrice', 'finalPrice'].includes(key) ? currency(value) : key === 'date' || key === 'completedDate' || key === 'arrival' ? formatDateWithDay(value) : String(value)}</dd></div>)}</div>
}
function BookingFlow({ customers, createGrooming }) {
  const [step, setStep] = useState('type')
  const [query, setQuery] = useState('')
  const [member, setMember] = useState({ dogName: '', guardianName: '', phone: '', breed: '시츄', gender: '남아', ageUnit: '개월', ageValue: '3', memo: '', visitPath: '네이버 검색' })
  const [reservation, setReservation] = useState(defaultGroomingForm())
  const ageValues = member.ageUnit === '개월' ? Array.from({ length: 12 }, (_, index) => String(index + 1)) : Array.from({ length: 20 }, (_, index) => String(index + 1))
  const filtered = customers.filter((customer) => matchesSearch([customer.guardianName, customer.dogName, customer.phone, customer.breed], query))
  function startNew() {
    setReservation(defaultGroomingForm())
    setStep('new-member')
  }
  function completeMember() {
    const ageMonths = member.ageValue + member.ageUnit
    setReservation((prev) => ({ ...prev, ...member, phone: formatPhoneNumber(member.phone), ageMonths, customerType: '신규 고객' }))
    setStep('reservation')
  }
  function selectCustomer(customer) {
    setReservation((prev) => ({ ...prev, guardianName: customer.guardianName, phone: formatPhoneNumber(customer.phone), dogName: customer.dogName, breed: customer.breed || prev.breed, customerType: '기존 고객' }))
    setStep('reservation')
  }
  function submitReservation() {
    createGrooming({ ...reservation, phone: formatPhoneNumber(reservation.phone) })
  }
  if (step === 'type') return <div className="bookingFlow"><div className="choiceGrid"><button type="button" onClick={startNew}><strong>신규 고객</strong><span>회원등록 후 예약정보 입력</span></button><button type="button" onClick={() => setStep('existing')}><strong>기존 고객</strong><span>검색 후 바로 예약정보 입력</span></button></div></div>
  if (step === 'new-member') return <div className="bookingFlow"><div className="detailGrid"><Input label="견명" value={member.dogName} onChange={(value) => setMember({ ...member, dogName: value })} /><Input label="보호자 이름" value={member.guardianName} onChange={(value) => setMember({ ...member, guardianName: value })} /><Input label="보호자 전화번호" value={member.phone} onChange={(value) => setMember({ ...member, phone: formatPhoneNumber(value) })} /><Input label="견종" value={member.breed} onChange={(value) => setMember({ ...member, breed: value })} /><Select label="성별" value={member.gender} onChange={(value) => setMember({ ...member, gender: value })} options={genderOptions} /><Select label="나이 단위" value={member.ageUnit} onChange={(value) => setMember({ ...member, ageUnit: value, ageValue: '1' })} options={['개월', '살']} /><Select label="나이/개월수" value={member.ageValue} onChange={(value) => setMember({ ...member, ageValue: value })} options={ageValues} /><Select label="첫 방문 경로" value={member.visitPath} onChange={(value) => setMember({ ...member, visitPath: value })} options={visitPathOptions} /><Input label="특이사항" value={member.memo} onChange={(value) => setMember({ ...member, memo: value })} /></div><div className="modalActions"><button type="button" onClick={() => setStep('type')}>이전</button><button className="primaryAction" type="button" onClick={completeMember}>회원등록 완료</button></div></div>
  if (step === 'existing') return <div className="bookingFlow"><Input label="보호자 전화번호 또는 견명 검색" value={query} onChange={setQuery} /><div className="modalList customerPickList">{filtered.map((customer) => <button className="modalLine" type="button" key={customer.phone} onClick={() => selectCustomer(customer)}><strong>{customer.guardianName} · {customer.dogName}</strong><span>{formatPhoneNumber(customer.phone)}</span></button>)}</div><div className="modalActions"><button type="button" onClick={() => setStep('type')}>이전</button></div></div>
  return <div className="bookingFlow"><div className="detailGrid"><Input label="예약날짜" type="date" value={reservation.date} onChange={(value) => setReservation({ ...reservation, date: value })} /><Input label="예약시간" type="time" value={reservation.time} onChange={(value) => setReservation({ ...reservation, time: value })} /><Select label="서비스유형" value={reservation.serviceType} onChange={(value) => setReservation({ ...reservation, serviceType: value })} options={serviceTypes} /><Select label="추가옵션" value={reservation.options} onChange={(value) => setReservation({ ...reservation, options: value })} options={additionalOptions} /><Input label="가격" type="number" value={reservation.price} onChange={(value) => setReservation({ ...reservation, price: value })} /><Select label="담당자" value={reservation.staff} onChange={(value) => setReservation({ ...reservation, staff: value })} options={staffList} /><Select label="진행상태" value={reservation.status} onChange={(value) => setReservation({ ...reservation, status: value })} options={statusList} /><Select label="결제상태" value={reservation.paymentStatus} onChange={(value) => setReservation({ ...reservation, paymentStatus: value })} options={paymentStatusList} /><Input label="특이사항" value={reservation.memo} onChange={(value) => setReservation({ ...reservation, memo: value })} /></div><div className="modalActions"><button type="button" onClick={() => setStep('type')}>처음으로</button><button className="primaryAction" type="button" onClick={submitReservation}>예약 저장</button></div></div>
}

function GroomingEditForm({ draft, setDraft, onSave, onDelete }) {
  const [cancelStep, setCancelStep] = useState(draft.status === '취소')
  const [cancelChoice, setCancelChoice] = useState('change')
  const [changeDate, setChangeDate] = useState(draft.date || today)
  const [changeTime, setChangeTime] = useState(draft.time || '10:00')
  const [cancelMemo, setCancelMemo] = useState('')
  const handleStatus = (value) => {
    setDraft({ ...draft, status: value })
    setCancelStep(value === '취소')
  }
  const saveCancelFlow = () => {
    if (cancelChoice === 'change') {
      onSave({ ...draft, date: changeDate, time: changeTime, status: '예약확정', memo: appendMemo(draft.memo, '기존 예약 취소 후 날짜/시간 변경') })
      return
    }
    onSave({ ...draft, status: '취소', memo: appendMemo(draft.memo, cancelMemo || '취소 처리') })
  }
  return <div className="editArea"><div className="detailGrid">{groomingFields.map((field) => field.key === 'status' ? <Select key={field.key} label={field.label} value={draft[field.key]} onChange={handleStatus} options={field.options} /> : field.options ? <Select key={field.key} label={field.label} value={draft[field.key]} onChange={(value) => setDraft({ ...draft, [field.key]: value })} options={field.options} /> : <Input key={field.key} fieldKey={field.key} label={field.label} type={field.type || 'text'} value={draft[field.key]} onChange={(value) => setDraft({ ...draft, [field.key]: isPhoneField(field.key, field.label) ? formatPhoneNumber(value) : value })} />)}</div>{cancelStep && <section className="cancelPanel"><h3>예약 변경 또는 취소 처리</h3><div className="choiceGrid compactChoice"><button className={cancelChoice === 'change' ? 'selected' : ''} type="button" onClick={() => setCancelChoice('change')}><strong>예약 날짜/시간 변경</strong></button><button className={cancelChoice === 'cancel' ? 'selected' : ''} type="button" onClick={() => setCancelChoice('cancel')}><strong>취소 처리</strong></button></div>{cancelChoice === 'change' ? <div className="detailGrid"><Input label="변경할 예약날짜" type="date" value={changeDate} onChange={setChangeDate} /><Input label="변경할 예약시간" type="time" value={changeTime} onChange={setChangeTime} /></div> : <Input label="취소 메모" value={cancelMemo} onChange={setCancelMemo} />}</section>}<div className="modalActions"><button className="primaryAction dangerAction" type="button" onClick={() => onDelete(draft.id)}>삭제</button>{cancelStep ? <button className="primaryAction" type="button" onClick={saveCancelFlow}>저장</button> : <button className="primaryAction" type="button" onClick={() => onSave({ ...draft, phone: formatPhoneNumber(draft.phone) })}>저장</button>}</div></div>
}
function EditForm({ draft, setDraft, fields, onSave, extra, onDelete }) {
  return <div className="editArea"><div className="detailGrid">{fields.map((field) => field.options ? <Select key={field.key} label={field.label} value={draft[field.key]} onChange={(value) => setDraft({ ...draft, [field.key]: value })} options={field.options} /> : field.type === 'file' ? <ReceiptInput key={field.key} label={field.label} onChange={(fileName) => field.key === 'photoUpload' ? setDraft({ ...draft, photoName: fileName }) : setDraft({ ...draft, receiptAttached: Boolean(fileName), receiptName: fileName })} /> : <Input key={field.key} fieldKey={field.key} label={field.label} type={field.type || 'text'} value={draft[field.key]} onChange={(value) => setDraft({ ...draft, [field.key]: isPhoneField(field.key, field.label) ? formatPhoneNumber(value) : value })} />)}</div><div className="modalActions"><button type="button">수정</button>{extra}{onDelete && <button className="primaryAction dangerAction" type="button" onClick={onDelete}>삭제</button>}<button className="primaryAction" type="button" onClick={onSave}>저장</button></div></div>
}
const groomingFields = [{ key: 'dogName', label: '견명' }, { key: 'breed', label: '견종' }, { key: 'guardianName', label: '보호자 이름' }, { key: 'phone', label: '전화번호' }, { key: 'date', label: '예약날짜', type: 'date' }, { key: 'time', label: '예약시간', type: 'time' }, { key: 'serviceType', label: '서비스유형', options: serviceTypes }, { key: 'options', label: '추가옵션', options: additionalOptions }, { key: 'price', label: '가격', type: 'number' }, { key: 'staff', label: '담당자', options: staffList }, { key: 'status', label: '진행상태', options: statusList }, { key: 'paymentStatus', label: '결제상태', options: paymentStatusList }, { key: 'paymentMethod', label: '결제수단' }, { key: 'memo', label: '메모' }]
const adoptionFields = [{ key: 'dogName', label: '견명' }, { key: 'breed', label: '견종' }, { key: 'guardianName', label: '보호자 이름' }, { key: 'phone', label: '전화번호' }, { key: 'date', label: '상담일', type: 'date' }, { key: 'consultant', label: '담당자' }, { key: 'status', label: '상담상태', options: ['상담중', '입양완료', '보류', '확인필요'] }, { key: 'price', label: '입양가', type: 'number' }, { key: 'paymentMethod', label: '결제수단' }, { key: 'memo', label: '메모' }]
const puppyFields = [{ key: 'profileNo', label: '관리번호' }, { key: 'arrival', label: '입소일', type: 'date' }, { key: 'name', label: '견명' }, { key: 'breed', label: '견종' }, { key: 'gender', label: '성별', options: genderOptions }, { key: 'birth', label: '생년월일', type: 'date' }, { key: 'ageMonths', label: '개월수' }, { key: 'coatColor', label: '모색' }, { key: 'source', label: '입소처' }, { key: 'intakeAmount', label: '도입가', type: 'number' }, { key: 'adoptionPrice', label: '입양가', type: 'number' }, { key: 'status', label: '현재상태', options: puppyStatusList }, { key: 'healthStatus', label: '건강상태' }, { key: 'vaccination', label: '접종정보' }, { key: 'guardianName', label: '보호자 이름' }, { key: 'phone', label: '보호자 전화번호' }, { key: 'consultant', label: '담당자' }, { key: 'completedDate', label: '입양완료일', type: 'date' }, { key: 'photoUpload', label: '사진첨부', type: 'file' }, { key: 'memo', label: '특이사항' }]
const supplyFields = [{ key: 'date', label: '매입일', type: 'date' }, { key: 'vendor', label: '거래처' }, { key: 'itemType', label: '품목구분', options: itemTypes }, { key: 'summary', label: '매입내용' }, { key: 'totalAmount', label: '총매입금액', type: 'number' }, { key: 'paymentMethod', label: '결제수단' }, { key: 'status', label: '처리상태', options: processStatusList }, { key: 'receiptName', label: '영수증명' }, { key: 'receiptUpload', label: '영수증 첨부', type: 'file' }, { key: 'memo', label: '메모' }]
const accountingFields = [{ key: 'date', label: '날짜', type: 'date' }, { key: 'type', label: '구분', options: ['수익', '비용'] }, { key: 'title', label: '항목명' }, { key: 'customerVendor', label: '고객/거래처' }, { key: 'dogName', label: '견명' }, { key: 'guardianName', label: '보호자 이름' }, { key: 'staff', label: '담당자' }, { key: 'amount', label: '금액', type: 'number' }, { key: 'paymentMethod', label: '결제수단' }, { key: 'status', label: '처리상태', options: processStatusList }, { key: 'settlementStatus', label: '정산상태', options: ['-', ...settlementStatusList] }, { key: 'receiptName', label: '영수증명' }, { key: 'receiptUpload', label: '영수증 첨부', type: 'file' }, { key: 'memo', label: '메모' }]
const settlementFields = [{ key: 'date', label: '날짜', type: 'date' }, { key: 'dogName', label: '견명' }, { key: 'guardianName', label: '보호자 이름' }, { key: 'salesAmount', label: '미용매출', type: 'number' }, { key: 'settlementAmount', label: '정산금액', type: 'number' }, { key: 'status', label: '정산상태', options: settlementStatusList }, { key: 'memo', label: '메모' }]

export default App
