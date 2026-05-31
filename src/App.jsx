import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wtvhghduhnyefewuvcpc.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0dmhnaGR1aG55ZWZld3V2Y3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODg5NjksImV4cCI6MjA5MzI2NDk2OX0.fyjCAAszJqaBi8c0NdiUZdGlPOFlMOoUwoAdvQbdOUY'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const STORAGE_KEY = 'haebaragi-puppyhouse-final-dashboard-v3'
const LEGACY_KEY = 'haebaragi-puppyhouse-final-dashboard-v2'
const today = (() => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return year + '-' + month + '-' + day
})()
const LOGIN_KEY = 'haebaragi-current-user'
const AUTH_USERS = [
  { id: 'admin', name: '관리자', role: 'admin', password: '0505' },
  { id: 'user', name: '사용자', role: 'user', password: '0505' },
]
const currentMonth = today.slice(0, 7)

const tabs = ['미용케어', '입양관리', '고객관리', '용품관리', '정산관리']
const staffList = ['원장님', '예슬님']
const statusList = ['예약대기', '예약확정', '진행중', '진행완료', '취소']
const paymentStatusList = ['미결제', '예약금완료', '결제완료', '환불', '해당없음']
const itemTypes = ['사료', '간식', '패드', '목욕용품', '기타']
const supplyPaymentMethods = ['현금', '카드', '계좌이체', '기타']
const timeOptions = Array.from({ length: ((20 - 9) * 60 + 50) / 10 + 1 }, (_, index) => {
  const total = 9 * 60 + index * 10
  return String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0')
})
const serviceTypes = ['전체미용', '부분미용', '목욕', '위생케어', '기타']
const additionalOptions = ['가위컷', '스포팅', '얼굴컷', '클리핑', '기타']
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
  supplyVendors: 'supply_vendors',
}
const SUPABASE_DATA_KEYS = ['groomingReservations', 'adoptionConsultations', 'puppies', 'supplyPurchases', 'supplyVendors', 'accountingEntries', 'settlementEntries']

const seedData = {
  supplyVendors: [],
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
function normalizePhone(value) {
  return phoneDigits(value)
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
function normalizePaymentMethod(value) {
  const text = String(value || '').trim().toLowerCase()
  if (!text) return '기타'
  if (['현금', 'cash'].includes(text)) return '현금'
  if (['카드', 'card', 'credit', 'credit card', '체크카드'].includes(text)) return '카드'
  if (['계좌이체', '계좌', 'transfer', 'bank', 'bank transfer', '이체'].includes(text)) return '계좌이체'
  if (supplyPaymentMethods.includes(String(value).trim())) return String(value).trim()
  return '기타'
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
  if (status === '예약확정' || status === '방문예정') return '예약확정'
  if (status === '진행중') return '진행중'
  if (status === '진행완료' || status === '완료' || status === '결제완료') return '진행완료'
  return '예약대기'
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
function normalizeServiceType(value) {
  const text = String(value ?? '').trim()
  return serviceTypes.includes(text) ? text : '기타'
}
function normalizeAdditionalOptions(value) {
  const text = Array.isArray(value) ? value.join(', ') : String(value ?? '').trim()
  return additionalOptions.includes(text) ? text : '기타'
}
function splitAdditionalOptions(value) {
  return normalizeAdditionalOptions(value).split(', ').filter(Boolean)
}
function calculateAgeMonths(birth) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(birth || ''))) return ''
  const born = new Date(String(birth) + 'T00:00:00')
  const now = new Date(today + 'T00:00:00')
  if (Number.isNaN(born.getTime()) || born > now) return ''
  let months = (now.getFullYear() - born.getFullYear()) * 12 + now.getMonth() - born.getMonth()
  if (now.getDate() < born.getDate()) months -= 1
  return months >= 0 ? months + '개월' : ''
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
    serviceType: normalizeServiceType(item.serviceType || item.service),
    options: normalizeAdditionalOptions(item.options),
    status: normalizeGroomingStatus(status),
    paymentStatus: item.paymentStatus || (item.status === '결제완료' ? '결제완료' : '미결제'),
    paymentMethod: normalizePaymentMethod(item.paymentMethod || item.payment || '카드'),
    price: moneyNumber(item.price),
    customerId: normalizeCustomerId(item.customerId || ''),
    gender: item.gender || '',
    age: item.age || item.ageMonths || '',
    ageMonths: item.ageMonths || item.age || '',
    visitSource: item.visitSource || item.visitPath || '',
    visitPath: item.visitPath || item.visitSource || '',
    customerType: item.customerType || '기존 고객',
    memo: item.memo || '',
  }
}
function normalizeAdoptionStatus(value) {
  const status = String(value || '').trim()
  if (status === '분양완료') return '입양완료'
  if (status === '입양확정') return '입양완료'
  if (status === '계약진행') return '상담중'
  if (['신규상담', '상담중', '방문예약', '상담완료', '입양완료', '보류', '취소'].includes(status)) return status
  if (status === '확인필요') return '상담중'
  return '신규상담'
}
function toAdoption(item) {
  return {
    id: item.id || `a-${Date.now()}`,
    date: item.date || today,
    dogName: item.dogName || item.dog || item.name || item.preferredBreed || '',
    breed: item.breed || item.preferredBreed || '시츄',
    guardianName: item.guardianName || item.guardian || '',
    phone: formatPhoneNumber(item.phone || item.ownerPhone || item.guardianPhone || ''),
    puppyId: item.puppyId || '',
    profileNo: item.profileNo || '',
    gender: item.gender || '',
    ageMonths: calculateAgeMonths(item.birth) || item.ageMonths || '',
    arrival: item.arrival || '',
    adoptionDate: item.adoptionDate || item.completedDate || '',
    intakeAmount: moneyNumber(item.intakeAmount ?? item.purchasePrice ?? item.purchaseAmount),
    adopterMemo: item.adopterMemo || '',
    region: item.region || '',
    preferredBreed: item.preferredBreed || item.breed || '',
    preferredGender: item.preferredGender || '',
    budget: moneyNumber(item.budget),
    visitDate: item.visitDate || '',
    route: item.route || item.visitPath || '',
    contractProgress: item.contractProgress || '미진행',
    consultant: replaceRole(item.consultant || item.counselor || '퍼피 컨설턴트'),
    status: normalizeAdoptionStatus(item.status),
    price: moneyNumber(item.price || item.adoptionPrice || item.finalPrice),
    paymentMethod: normalizePaymentMethod(item.paymentMethod || '계좌이체'),
    memo: item.memo || '',
    specialNote: item.specialNote || '',
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
    ageMonths: calculateAgeMonths(item.birth) || item.ageMonths || item.age || '',
    coatColor: item.coatColor || '',
    arrival: item.arrival || item.inDate || '',
    source: item.source || '',
    intakeAmount: moneyNumber(item.intakeAmount),
    adoptionPrice: moneyNumber(item.adoptionPrice || item.finalPrice || item.price),
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
function isCompletedAdoptionStatus(status) {
  return ['입양확정', '입양완료', '상담완료', '보류'].includes(String(status || '').trim())
}
function matchingActivityDate(row) {
  return row?.adoptionDate || row?.completedDate || row?.date || ''
}
function isActiveMatchingRow(row) {
  return matchingActivityDate(row) === today && row?.status !== '취소'
}
function activePuppyRows(puppies) {
  return puppies.filter((puppy) => !isAdoptedPuppy(puppy))
}
function adoptionDisplayRow(item) {
  const { preferredBreed, preferredGender, budget, visitDate, route, contractProgress, memo, ...rest } = item || {}
  return { ...rest, specialNote: rest.specialNote || memo || '' }
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
    totalAmount: moneyNumber(item.totalAmount ?? item.amount),
    paymentMethod: normalizePaymentMethod(item.paymentMethod || item.payment || '카드'),
    status: item.status || '처리완료',
    receiptAttached: Boolean(item.receiptAttached),
    receiptName: item.receiptName || '',
    memo: item.memo || '',
  }
}
function toSupplyVendor(item) {
  return {
    id: item.id || 'vendor-' + Date.now(),
    name: item.name || item.vendor || '',
    manager: item.manager || '',
    phone: formatPhoneNumber(item.phone || item.contact || ''),
    mainItem: item.mainItem || item.itemType || '사료',
    paymentMethod: normalizePaymentMethod(item.paymentMethod || '계좌이체'),
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
    amount: moneyNumber(item.amount),
    paymentMethod: normalizePaymentMethod(item.paymentMethod || item.payment || '카드'),
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
    amount: moneyNumber(item.price),
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
    amount: moneyNumber(item.price),
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
    amount: moneyNumber(item.totalAmount),
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
    salesAmount: moneyNumber(item.price),
    settlementAmount: Math.round(moneyNumber(item.price) * 0.6),
    status: old?.status || '미정산',
    memo: old?.memo || '',
  }
}
function supabaseRowId(item, fallback) {
  return String(item?.id || item?.phone || item?.profileNo || fallback)
}
function collectionRowsForSupabase(key, rows) {
  return (rows || []).map((item, index) => {
    const normalized = key === 'customers' ? normalizeCustomerRecord(item) : item
    return { id: supabaseRowId(normalized, key + '-' + index), data: normalized }
  })
}
function customerOwnerName(item = {}) {
  return item.guardianName || item.ownerName || item.customerName || ''
}
function customerPhone(item = {}) {
  return formatPhoneNumber(item.phone || item.ownerPhone || item.guardianPhone || '')
}
function customerDogName(item = {}) {
  return item.dogName || item.petName || item.name || ''
}
function customerLookupKey(item = {}) {
  const digits = normalizePhone(item.phone || item.ownerPhone || item.guardianPhone || '')
  if (digits) return 'phone-' + digits
  const owner = customerOwnerName(item).trim()
  const dog = customerDogName(item).trim()
  return owner && dog ? 'name-' + owner + '-' + dog : ''
}
function normalizeCustomerId(value) {
  const text = String(value || '').trim()
  if (!text) return ''
  const decoded = text.replace(/%3A/gi, ':').replace(/%2D/gi, '-')
  const phoneMatch = decoded.match(/^c-phone[:-](\d{7,11})$/)
  if (phoneMatch) return 'c-phone-' + normalizePhone(phoneMatch[1])
  const rawDigits = normalizePhone(decoded)
  if (decoded.startsWith('c-phone') && rawDigits) return 'c-phone-' + rawDigits
  return text
}
function customerIdFromRecord(item = {}) {
  const normalizedPhone = normalizePhone(item.phone || item.ownerPhone || item.guardianPhone || '')
  if (normalizedPhone) return 'c-phone-' + normalizedPhone
  const normalizedId = normalizeCustomerId(item.id || item.customerId || '')
  if (normalizedId) return normalizedId
  const lookup = customerLookupKey(item).replace(/[^a-zA-Z0-9-]/g, '-')
  return lookup ? 'c-' + lookup : ''
}
function normalizeCustomerRecord(item = {}) {
  const now = new Date().toISOString()
  const guardianName = customerOwnerName(item)
  const phone = customerPhone(item)
  const dogName = customerDogName(item)
  const visitCount = Number(item.visitCount || 0)
  const totalPaid = moneyNumber(item.totalPaid)
  const grooming = Number(item.grooming || 0)
  const adoption = Number(item.adoption || 0)
  const grade = item.grade || (visitCount >= 10 || totalPaid >= 1000000 ? 'VIP' : visitCount >= 5 ? '\uB2E8\uACE8' : visitCount >= 2 ? '\uC7AC\uBC29\uBB38' : '\uC2E0\uADDC')
  const customerType = item.customerType || [grooming > 0 ? '\uBBF8\uC6A9\uACE0\uAC1D' : null, adoption > 0 ? '\uC785\uC591\uACE0\uAC1D' : null].filter(Boolean).join(' \u00B7 ') || '\uC77C\uBC18\uACE0\uAC1D'
  const badges = Array.isArray(item.badges) && item.badges.length ? item.badges : [grade, grooming > 0 ? '\uBBF8\uC6A9\uACE0\uAC1D' : null, adoption > 0 ? '\uC785\uC591\uACE0\uAC1D' : null].filter(Boolean)
  const customerId = customerIdFromRecord({ ...item, phone, ownerPhone: phone, guardianName, ownerName: guardianName, dogName })
  return {
    ...item,
    id: customerId || 'c-' + Date.now(),
    ownerName: guardianName,
    ownerPhone: phone,
    guardianName,
    phone,
    dogName,
    breed: item.breed || '-',
    gender: item.gender || '',
    age: item.age || item.ageMonths || '',
    ageMonths: item.ageMonths || item.age || '',
    memo: item.memo || item.specialNote || '',
    specialNote: item.specialNote || item.memo || '',
    visitSource: item.visitSource || item.visitPath || '',
    visitPath: item.visitPath || item.visitSource || '',
    grooming,
    adoption,
    visitCount,
    totalPaid,
    lastVisitDate: item.lastVisitDate || '',
    grade,
    customerType,
    badges,
    createdAt: item.createdAt || now,
    updatedAt: item.updatedAt || now,
  }
}
function customerMatchesSource(customer = {}, source = {}) {
  const customerId = normalizeCustomerId(customer.id || customer.customerId || '')
  const sourceCustomerId = normalizeCustomerId(source.customerId || source.id || '')
  if (customerId && sourceCustomerId && customerId === sourceCustomerId) return true
  const customerDigits = normalizePhone(customer.phone || customer.ownerPhone || customer.guardianPhone || '')
  const sourceDigits = normalizePhone(source.phone || source.ownerPhone || source.guardianPhone || '')
  if (customerDigits && sourceDigits && customerDigits === sourceDigits) return true
  const customerOwner = customerOwnerName(customer).trim()
  const sourceOwner = customerOwnerName(source).trim()
  const customerDog = customerDogName(customer).trim()
  const sourceDog = customerDogName(source).trim()
  return Boolean(customerOwner && sourceOwner && customerDog && sourceDog && customerOwner === sourceOwner && customerDog === sourceDog)
}
function findMatchingCustomer(rows = [], source = {}) {
  return (rows || []).map(normalizeCustomerRecord).find((customer) => customerMatchesSource(customer, source)) || null
}
function customerFromGroomingReservation(grooming, existingCustomer, { incrementVisit = false } = {}) {
  const existing = existingCustomer ? normalizeCustomerRecord(existingCustomer) : {}
  const now = new Date().toISOString()
  const paidAmount = grooming.paymentStatus === '\uACB0\uC81C\uC644\uB8CC' ? moneyNumber(grooming.price) : 0
  const nextVisitCount = Number(existing.visitCount || 0) + (incrementVisit ? 1 : 0)
  const nextGrooming = Number(existing.grooming || 0) + (incrementVisit ? 1 : 0)
  const nextTotalPaid = moneyNumber(existing.totalPaid) + (incrementVisit ? paidAmount : 0)
  const lastVisitDate = grooming.date && (!existing.lastVisitDate || grooming.date > existing.lastVisitDate) ? grooming.date : existing.lastVisitDate || grooming.date || ''
  return normalizeCustomerRecord({
    ...existing,
    id: existing.id,
    guardianName: grooming.guardianName || existing.guardianName || existing.ownerName || '',
    ownerName: grooming.guardianName || existing.ownerName || existing.guardianName || '',
    phone: grooming.phone || existing.phone || existing.ownerPhone || '',
    ownerPhone: grooming.phone || existing.ownerPhone || existing.phone || '',
    dogName: grooming.dogName || existing.dogName || '',
    breed: grooming.breed || existing.breed || '',
    gender: grooming.gender || existing.gender || '',
    age: grooming.age || grooming.ageMonths || existing.age || existing.ageMonths || '',
    ageMonths: grooming.ageMonths || grooming.age || existing.ageMonths || existing.age || '',
    memo: grooming.memberMemo || grooming.specialNote || grooming.memo || existing.memo || existing.specialNote || '',
    specialNote: grooming.specialNote || grooming.memberMemo || grooming.memo || existing.specialNote || existing.memo || '',
    visitSource: grooming.visitSource || grooming.visitPath || existing.visitSource || existing.visitPath || '',
    visitPath: grooming.visitPath || grooming.visitSource || existing.visitPath || existing.visitSource || '',
    grooming: nextGrooming,
    visitCount: nextVisitCount,
    totalPaid: nextTotalPaid,
    lastVisitDate,
    createdAt: existing.createdAt || now,
    updatedAt: now,
  })
}
function upsertCustomerRows(rows = [], customer) {
  const normalized = normalizeCustomerRecord(customer)
  const next = []
  let replaced = false
  ;(rows || []).map(normalizeCustomerRecord).forEach((row) => {
    if (customerMatchesSource(row, normalized)) {
      if (!replaced) next.push({ ...row, ...normalized, createdAt: row.createdAt || normalized.createdAt, updatedAt: normalized.updatedAt })
      replaced = true
    } else {
      next.push(row)
    }
  })
  if (!replaced) next.unshift(normalized)
  return next
}
async function readSupabaseCollection(key) {
  const table = SUPABASE_TABLES[key]
  if (!table) return []
  const { data: rows, error } = await supabase.from(table).select('id,data').order('updated_at', { ascending: false })
  if (error) {
    if (key === 'supplyVendors') {
      console.warn('supply_vendors 테이블을 찾을 수 없어 localStorage 백업을 사용합니다.', error)
      return []
    }
    throw error
  }
  return (rows || []).map((row) => {
    const item = { id: row.id, ...(row.data || {}) }
    return key === 'customers' ? normalizeCustomerRecord(item) : item
  })
}
async function loadSupabaseDashboardData() {
  const result = {}
  let foundRemoteRows = false
  const [customerRows] = await Promise.all([
    readSupabaseCollection('customers').catch((error) => {
      console.warn('customers Supabase 조회 실패, 파생 고객 목록을 사용합니다.', error)
      return []
    }),
    Promise.all(SUPABASE_DATA_KEYS.map(async (key) => {
      const rows = await readSupabaseCollection(key)
      result[key] = rows
      if (rows.length > 0) foundRemoteRows = true
    })),
  ])
  return {
    data: foundRemoteRows ? normalizeData({ ...seedData, ...result }) : null,
    customers: customerRows,
    hasCustomers: customerRows.length > 0,
    foundRemoteRows,
  }
}
async function syncSupabaseCollection(key, rows) {
  const table = SUPABASE_TABLES[key]
  if (!table) return
  const localRows = collectionRowsForSupabase(key, rows)
  const localIds = new Set(localRows.map((row) => row.id))
  if (localRows.length > 0) {
    const { error } = await supabase.from(table).upsert(localRows, { onConflict: 'id' })
    if (error) {
      if (key === 'supplyVendors') {
        console.warn('거래처 Supabase 저장 실패, localStorage 백업을 유지합니다.', error)
        return
      }
      throw error
    }
  }
  const { data: remoteRows, error: selectError } = await supabase.from(table).select('id')
  if (selectError) {
    if (key === 'supplyVendors') return
    throw selectError
  }
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
async function deleteSupabaseRecord(key, id) {
  const table = SUPABASE_TABLES[key]
  if (!table || !id) return
  const { error } = await supabase.from(table).delete().eq('id', String(id))
  if (error) throw error
}
async function upsertSupabaseRecord(key, item) {
  const table = SUPABASE_TABLES[key]
  if (!table || !item) return
  const row = collectionRowsForSupabase(key, [item])[0]
  const { error } = await supabase.from(table).upsert([row], { onConflict: 'id' })
  if (error) {
    console.error('Supabase upsert failed', { key, table, row, error })
    throw error
  }
}
function supabaseErrorDetails(error) {
  return [error?.message, error?.details, error?.hint, error?.code ? 'code: ' + error.code : ''].filter(Boolean).join('\n')
}
function alertSupabaseError(error, message = '\u0053upabase \uC800\uC7A5 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.') {
  const details = supabaseErrorDetails(error)
  const text = details ? message + '\n\n' + details : message
  console.error(message, error)
  window.alert(text)
}
function syncDerivedData(data) {
  const withDefaults = { ...data, supplyVendors: data.supplyVendors || [] }
  data = withDefaults
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
    supplyVendors: (legacy.supplyVendors || legacy.suppliers || seedData.supplyVendors || []).map(toSupplyVendor),
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
  return ['정산관리', '통합데이터'].includes(tab)
}
function formatCurrency(value) {
  if (value === undefined || value === null || value === '') return ''
  const cleaned = String(value).replace(/[^0-9.-]/g, '')
  if (cleaned === '' || cleaned === '-' || Number.isNaN(Number(cleaned))) return ''
  return Number(cleaned).toLocaleString('ko-KR')
}
function moneyNumber(value) {
  if (value === undefined || value === null || value === '') return 0
  const cleaned = String(value).replace(/[^0-9.-]/g, '')
  return cleaned === '' || Number.isNaN(Number(cleaned)) ? 0 : Number(cleaned)
}
function currency(value) {
  const formatted = formatCurrency(value)
  return formatted === '' ? '-' : `${formatted}원`
}
function petLabel(item) {
  return `${item.dogName || item.name || item.title} (${item.guardianName || '보호자 미정'})`
}
function defaultGroomingForm() {
  return { date: today, time: '18:00', staff: '원장님', dogName: '', breed: '시츄', gender: '남아', ageMonths: '3개월', guardianName: '', phone: '', serviceType: '전체미용', options: '가위컷', status: '예약대기', paymentStatus: '미결제', paymentMethod: '카드', price: 0, customerType: '신규 고객', memo: '', visitPath: '네이버 검색' }
}
function defaultSupplyForm() {
  return { date: today, vendor: '', itemType: '사료', summary: '', totalAmount: 0, paymentMethod: '카드', status: '처리완료', receiptAttached: false, receiptName: '', memo: '' }
}
function defaultSupplyVendor() {
  return { id: 'vendor-' + Date.now(), name: '', manager: '', phone: '', mainItem: '사료', paymentMethod: '계좌이체', memo: '' }
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
  const [year, month, day] = String(baseDate || today).split('-').map(Number)
  const date = new Date(year, month - 1, day + offsetDays)
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
}
function shiftMonthValue(month, offset) {
  const [year, monthNumber] = String(month || currentMonth).split('-').map(Number)
  const date = new Date(year, monthNumber - 1 + offset, 1)
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0')
}
function formatMonthTitle(month) {
  const [year, monthNumber] = String(month || currentMonth).split('-')
  return year + '\uB144 ' + Number(monthNumber) + '\uC6D4'
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
  data.groomingReservations.forEach((item) => rows.push({ id: 'stat-g-' + item.id, date: item.date, category: '미용', dogName: item.dogName, breed: item.breed, guardianName: item.guardianName, phone: formatPhoneNumber(item.phone), staff: item.staff, content: [item.serviceType, item.options].filter(Boolean).join(' / '), status: [item.status, item.paymentStatus].filter(Boolean).join(' / '), amount: moneyNumber(item.price), memo: item.memo || '' }))
  data.adoptionConsultations.forEach((item) => rows.push({ id: 'stat-a-' + item.id, date: item.date, category: item.status === '입양완료' ? '입양' : '상담', dogName: item.dogName, breed: item.breed, guardianName: item.guardianName, phone: formatPhoneNumber(item.phone), staff: replaceRole(item.consultant), content: '퍼피 매칭관리', status: item.status, amount: moneyNumber(item.price), memo: item.memo || '' }))
  data.puppies.forEach((item) => rows.push({ id: 'stat-p-' + item.id, date: item.completedDate || item.arrival || today, category: item.status === '입양완료' ? '입양 관리' : '퍼피 프로파일', dogName: item.name || item.dogName, breed: item.breed, guardianName: item.guardianName, phone: formatPhoneNumber(item.phone), staff: replaceRole(item.consultant), content: item.profileNo || '퍼피 프로파일', status: item.status, amount: moneyNumber(item.adoptionPrice || item.finalPrice || item.intakeAmount), memo: item.memo || '' }))
  ;(data.supplyVendors || []).forEach((item) => rows.push({ id: 'stat-vendor-' + item.id, date: '', category: '거래처', dogName: '', breed: '', guardianName: item.name, phone: formatPhoneNumber(item.phone), staff: item.manager || '-', content: [item.mainItem, item.paymentMethod].filter(Boolean).join(' / '), status: '등록', amount: 0, memo: item.memo || '' }))
  data.supplyPurchases.forEach((item) => rows.push({ id: 'stat-s-' + item.id, date: item.date, category: '매입', dogName: '', breed: '', guardianName: item.vendor, phone: '', staff: '매장', content: [item.itemType, item.summary].filter(Boolean).join(' / '), status: item.status, amount: Number(item.totalAmount || 0), memo: item.memo || '' }))
  data.accountingEntries.forEach((item) => rows.push({ id: 'stat-acc-' + item.id, date: item.date, category: item.type || '회계', dogName: item.dogName, breed: '', guardianName: item.guardianName || item.customerVendor, phone: formatPhoneNumber(item.phone || item.ownerPhone || item.guardianPhone || ''), staff: item.staff, content: item.title, status: item.status, amount: moneyNumber(item.amount), memo: item.memo || '' }))
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
    current.totalPaid += moneyNumber(patch.totalPaid)
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
  const amount = moneyNumber(value)
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
    const accountingSource = (Array.isArray(data?.accountingEntries) ? data.accountingEntries : []).filter((item) => !['grooming', 'adoption'].includes(item.sourceKind) && item.category !== '미용매출')
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
  return rows.filter(filter).reduce((sum, item) => sum + moneyNumber(item.amount), 0)
}
function sumSettlement(rows, filter, key = 'settlementAmount') {
  return rows.filter(filter).reduce((sum, item) => sum + moneyNumber(item[key]), 0)
}
function App() {
  const [activeTab, setActiveTab] = useState('미용케어')
  const [loginUser, setLoginUser] = useState(loadLoginUser)
  const [data, setData] = useState(loadData)
  const [modal, setModal] = useState(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [adoptionMenu, setAdoptionMenu] = useState(adoptionMenus[0])
  const [groomingFilters, setGroomingFilters] = useState({ staff: '전체', status: '전체', from: currentMonth + '-01', to: currentMonth + '-31', query: '' })
  const [customerPhone, setCustomerPhone] = useState('010-1234-1001')
  const [customerFilter, setCustomerFilter] = useState('전체')
  const [customerQuery, setCustomerQuery] = useState('')
  const [customerMemos, setCustomerMemos] = useState(loadCustomerMemos)
  const [deletedCustomerPhones, setDeletedCustomerPhones] = useState(loadDeletedCustomerPhones)
  const [groomingForm, setGroomingForm] = useState(defaultGroomingForm)
  const [supplyForm, setSupplyForm] = useState(defaultSupplyForm)
  const [accountingForm, setAccountingForm] = useState(defaultAccountingForm)
  const [settlementFilters, setSettlementFilters] = useState({ from: currentMonth + '-01', to: currentMonth + '-31', unpaidOnly: false })
  const [accountingTab, setAccountingTab] = useState(accountingTabs[0])
  const [supabaseLoaded, setSupabaseLoaded] = useState(false)
  const [supabaseCustomers, setSupabaseCustomers] = useState({ loaded: false, rows: [] })
  const remoteApplyingRef = useRef(false)
  const visibleTabs = useMemo(() => isAdmin(loginUser) ? tabs : tabs.filter((tab) => !isRestrictedTab(tab)), [loginUser])

  useEffect(() => {
    if (!tabs.includes(activeTab) && activeTab !== '통합데이터') setActiveTab('미용케어')
  }, [activeTab])

  useEffect(() => {
    let mounted = true
    const localBackup = loadData()
    loadSupabaseDashboardData()
      .then((snapshot) => {
        if (!mounted) return
        remoteApplyingRef.current = true
        if (snapshot?.data) setData(syncDerivedData(snapshot.data))
        else setData(syncDerivedData(localBackup))
        if (snapshot?.hasCustomers) setSupabaseCustomers({ loaded: true, rows: snapshot.customers })
        window.setTimeout(() => { remoteApplyingRef.current = false }, 800)
      })
      .catch((error) => {
        console.error('Supabase 실시간 동기화 실패', error)
        if (mounted) setData(syncDerivedData(localBackup))
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
    localStorage.setItem('supplyVendors', JSON.stringify(data.supplyVendors || []))
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
  const customerSourceRows = supabaseCustomers.loaded ? supabaseCustomers.rows : rawCustomers
  const customers = useMemo(() => customerSourceRows.filter((customer) => !deletedCustomerPhones.includes(phoneDigits(customer.phone))), [customerSourceRows, deletedCustomerPhones])

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers))
  }, [customers])

  useEffect(() => {
    if (!supabaseLoaded || remoteApplyingRef.current) return undefined
    const timer = window.setTimeout(() => {
      syncDashboardToSupabase(data, customers).catch((error) => {
        alertSupabaseError(error)
      })
    }, 400)
    return () => window.clearTimeout(timer)
  }, [data, customers, supabaseLoaded])

  useEffect(() => {
    if (!supabaseLoaded) return undefined
    let disposed = false
    let refreshTimer = null
    const refreshFromSupabase = (includeCustomers = false) => {
      if (refreshTimer) window.clearTimeout(refreshTimer)
      refreshTimer = window.setTimeout(() => {
        loadSupabaseDashboardData()
          .then((snapshot) => {
            if (disposed) return
            remoteApplyingRef.current = true
            if (snapshot?.data) setData(syncDerivedData(snapshot.data))
            if (includeCustomers || snapshot?.hasCustomers) setSupabaseCustomers({ loaded: true, rows: snapshot?.customers || [] })
            localStorage.setItem('lastSupabaseSyncMessage', '데이터가 동기화되었습니다.')
            console.info('데이터가 동기화되었습니다.')
            window.setTimeout(() => { remoteApplyingRef.current = false }, 800)
          })
          .catch((error) => {
            console.error('Supabase 실시간 동기화 실패', error)
          })
      }, 250)
    }
    const channel = supabase.channel('haebaragi-dashboard-realtime')
    ;(['customers', ...SUPABASE_DATA_KEYS]).forEach((key) => {
      const table = SUPABASE_TABLES[key]
      if (!table) return
      channel.on('postgres_changes', { event: '*', schema: 'public', table }, () => refreshFromSupabase(key === 'customers'))
    })
    channel.subscribe()
    return () => {
      disposed = true
      if (refreshTimer) window.clearTimeout(refreshTimer)
      supabase.removeChannel(channel)
    }
  }, [supabaseLoaded])

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

  async function saveGroomingReservationWithCustomer(reservation, { isNew = false } = {}) {
    const base = toGrooming({ ...reservation, id: reservation.id || `g-${Date.now()}` })
    const matchedCustomer = findMatchingCustomer(customers, base)
    const customer = customerFromGroomingReservation(base, matchedCustomer, { incrementVisit: isNew })
    const normalized = toGrooming({ ...base, customerId: customer.id })
    const nextCustomers = upsertCustomerRows(customers, customer)
    try {
      console.info('Supabase grooming save start', { url: SUPABASE_URL, role: loginUser?.role || 'none', customerId: customer.id, reservationId: normalized.id })
      await upsertSupabaseRecord('customers', customer)
      await upsertSupabaseRecord('groomingReservations', normalized)
      setSupabaseCustomers({ loaded: true, rows: nextCustomers })
      localStorage.setItem('customers', JSON.stringify(nextCustomers))
      if (isNew) {
        commit((prev) => ({ ...prev, groomingReservations: [normalized, ...prev.groomingReservations] }))
      } else {
        commit((prev) => ({ ...prev, groomingReservations: prev.groomingReservations.map((item) => item.id === normalized.id ? normalized : item) }))
      }
      setModal(null)
    } catch (error) {
      console.error('Grooming customer/reservation Supabase save failed', { role: loginUser?.role || 'none', customer, reservation: normalized, error })
      alertSupabaseError(error, '\uACE0\uAC1D \uC800\uC7A5 \uB610\uB294 \uC608\uC57D \uC800\uC7A5 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uACE0\uAC1D\uC774 \uC800\uC7A5\uB418\uC9C0 \uC54A\uC544 \uC608\uC57D\uB3C4 \uC800\uC7A5\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.')
    }
  }
  function createGrooming(reservation) {
    saveGroomingReservationWithCustomer(reservation, { isNew: true })
  }
  function addGrooming(event) {
    event.preventDefault()
    createGrooming(groomingForm)
    setGroomingForm(defaultGroomingForm())
  }
  function saveGrooming(next) {
    saveGroomingReservationWithCustomer(next, { isNew: false })
  }
  async function deleteGrooming(id) {
    if (!isAdmin(loginUser)) {
      window.alert('삭제는 관리자만 가능합니다.')
      return
    }
    if (!window.confirm('이 예약을 삭제하시겠습니까?')) return
    try {
      await deleteSupabaseRecord('groomingReservations', id)
      commit((prev) => ({ ...prev, groomingReservations: prev.groomingReservations.filter((item) => item.id !== id) }))
      setModal(null)
    } catch (error) {
      alertSupabaseError(error, 'Supabase 저장 중 오류가 발생했습니다.')
    }
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
  function addSupplyVendor(next) {
    const normalized = toSupplyVendor({ ...next, id: next.id || 'vendor-' + Date.now() })
    commit((prev) => ({ ...prev, supplyVendors: [normalized, ...(prev.supplyVendors || [])] }))
    setModal(null)
  }
  function saveSupplyVendor(next) {
    const normalized = toSupplyVendor(next)
    commit((prev) => ({ ...prev, supplyVendors: (prev.supplyVendors || []).map((item) => item.id === normalized.id ? normalized : item) }))
    setModal(null)
  }
  async function deleteSupplyVendor(itemOrId) {
    if (!isAdmin(loginUser)) {
      window.alert('삭제는 관리자만 가능합니다.')
      return
    }
    const id = typeof itemOrId === 'object' ? itemOrId.id : itemOrId
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      await deleteSupabaseRecord('supplyVendors', id)
      commit((prev) => ({ ...prev, supplyVendors: (prev.supplyVendors || []).filter((item) => item.id !== id) }))
      setModal(null)
    } catch (error) {
      alertSupabaseError(error, 'Supabase 저장 중 오류가 발생했습니다.')
    }
  }
  async function deleteSupply(itemOrId) {
    if (!isAdmin(loginUser)) {
      window.alert('삭제는 관리자만 가능합니다.')
      return
    }
    const id = typeof itemOrId === 'object' ? itemOrId.id : itemOrId
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      await deleteSupabaseRecord('supplyPurchases', id)
      commit((prev) => ({ ...prev, supplyPurchases: prev.supplyPurchases.filter((item) => item.id !== id) }))
      setModal(null)
    } catch (error) {
      alertSupabaseError(error, 'Supabase 저장 중 오류가 발생했습니다.')
    }
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
  function finalizeAdoptionWithPuppy(prev, normalized) {
    if (!['입양완료', '입양확정'].includes(normalized.status)) return prev
    const targetId = normalized.puppyId
    if (!targetId) return prev
    const completedDate = normalized.adoptionDate || normalized.completedDate || today
    return {
      ...prev,
      puppies: prev.puppies.map((puppy) => puppy.id === targetId ? toPuppy({
        ...puppy,
        status: '입양완료',
        completedDate,
        guardianName: normalized.guardianName,
        phone: normalized.phone,
        consultant: normalized.consultant,
        adoptionPrice: normalized.price || puppy.adoptionPrice,
        memo: normalized.memo || puppy.memo,
      }) : puppy),
    }
  }
  function addAdoption(next = {}) {
    const normalized = toAdoption({ ...next, id: next.id || 'a-' + Date.now() })
    commit((prev) => {
      const duplicate = normalized.status === '입양완료' && normalized.puppyId ? prev.adoptionConsultations.find((item) => item.puppyId === normalized.puppyId) : null
      const row = duplicate ? { ...normalized, id: duplicate.id } : normalized
      const adoptionConsultations = duplicate ? prev.adoptionConsultations.map((item) => item.id === duplicate.id ? row : item) : [row, ...prev.adoptionConsultations]
      return finalizeAdoptionWithPuppy({ ...prev, adoptionConsultations }, row)
    })
    setModal(null)
  }
  function completeAdoption(item) {
    const completed = { ...toAdoption(item), status: '입양완료', adoptionDate: item.adoptionDate || today }
    commit((prev) => {
      const base = { ...prev, adoptionConsultations: prev.adoptionConsultations.map((adoption) => adoption.id === completed.id ? completed : adoption) }
      return finalizeAdoptionWithPuppy(base, completed)
    })
    setModal({ type: 'edit-adoption', title: '입양완료 처리', item: completed })
  }
  function saveAdoption(next) {
    const normalized = toAdoption(next)
    commit((prev) => {
      const exists = prev.adoptionConsultations.some((item) => item.id === normalized.id)
      const adoptionConsultations = exists ? prev.adoptionConsultations.map((item) => item.id === normalized.id ? normalized : item) : [normalized, ...prev.adoptionConsultations]
      return finalizeAdoptionWithPuppy({ ...prev, adoptionConsultations }, normalized)
    })
    setModal(null)
  }
  async function deleteAdoptionHistory(item) {
    if (!isAdmin(loginUser)) {
      window.alert('삭제는 관리자만 가능합니다.')
      return
    }
    if (!window.confirm('해당 입양 관리 내역을 삭제하시겠습니까?')) return
    try {
      if (item.sourceKind === 'adoption') await deleteSupabaseRecord('adoptionConsultations', item.sourceId)
      if (item.sourceKind === 'puppy') await deleteSupabaseRecord('puppies', item.sourceId)
      commit((prev) => {
        if (item.sourceKind === 'adoption') return { ...prev, adoptionConsultations: prev.adoptionConsultations.filter((row) => row.id !== item.sourceId) }
        if (item.sourceKind === 'puppy') return { ...prev, puppies: prev.puppies.filter((row) => row.id !== item.sourceId) }
        return prev
      })
      setModal(null)
    } catch (error) {
      alertSupabaseError(error, 'Supabase 저장 중 오류가 발생했습니다.')
    }
  }
  async function deleteAdoption(item) {
    if (!isAdmin(loginUser)) {
      window.alert('삭제는 관리자만 가능합니다.')
      return
    }
    const hasAccounting = data.accountingEntries.some((entry) => entry.sourceId === item.id || String(entry.sourceId || '').includes(item.id)) || ['입양완료', '입양완료'].includes(item.status)
    const message = hasAccounting ? '회계장부에 반영된 데이터일 수 있습니다. 삭제하시겠습니까?' : '해당 데이터를 삭제하시겠습니까?'
    if (!window.confirm(message)) return
    try {
      await deleteSupabaseRecord('adoptionConsultations', item.id)
      commit((prev) => ({ ...prev, adoptionConsultations: prev.adoptionConsultations.filter((row) => row.id !== item.id) }))
      setModal(null)
    } catch (error) {
      alertSupabaseError(error, 'Supabase 저장 중 오류가 발생했습니다.')
    }
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
  async function deletePuppy(itemOrId) {
    if (!isAdmin(loginUser)) {
      window.alert('삭제는 관리자만 가능합니다.')
      return
    }
    const target = typeof itemOrId === 'object' ? itemOrId : data.puppies.find((item) => item.id === itemOrId)
    const id = target?.id || itemOrId
    const message = target && ['입양완료', '분양완료'].includes(target.status) ? '회계장부에 반영된 데이터일 수 있습니다. 삭제하시겠습니까?' : '해당 데이터를 삭제하시겠습니까?'
    if (!window.confirm(message)) return
    try {
      await deleteSupabaseRecord('puppies', id)
      commit((prev) => ({ ...prev, puppies: prev.puppies.filter((item) => item.id !== id) }))
      setModal(null)
    } catch (error) {
      alertSupabaseError(error, 'Supabase 저장 중 오류가 발생했습니다.')
    }
  }
  function completePuppyAdoption(next) {
    if (!window.confirm('입양완료 처리하면 퍼피 프로파일 목록에서 사라지고 퍼피 입양 관리 내역으로 이동됩니다. 계속하시겠습니까?')) return
    const normalized = toPuppy({ ...next, status: '입양완료', completedDate: next.completedDate || today })
    savePuppy(normalized)
  }
  function saveSettlement(next) {
    commit((prev) => ({ ...prev, settlementEntries: prev.settlementEntries.map((item) => item.id === next.id ? { ...next, salesAmount: moneyNumber(next.salesAmount), settlementAmount: moneyNumber(next.settlementAmount) } : item) }))
    setModal(null)
  }
  function setSettlementStatus(id, status) {
    commit((prev) => ({ ...prev, settlementEntries: prev.settlementEntries.map((item) => item.id === id ? { ...item, status } : item), accountingEntries: prev.accountingEntries.map((item) => item.id === id.replace('set-', 'acc-grooming-') ? { ...item, settlementStatus: status } : item) }))
    setModal(null)
  }
  async function deleteCustomer(customer) {
    if (!isAdmin(loginUser)) {
      window.alert('삭제는 관리자만 가능합니다.')
      return
    }
    if (!customer?.phone) return
    if (!window.confirm('\uD574\uB2F9 \uACE0\uAC1D \uC815\uBCF4\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?')) return
    try {
      await deleteSupabaseRecord('customers', customer.id || customer.phone)
      const phoneKey = phoneDigits(customer.phone)
      setDeletedCustomerPhones((prev) => Array.from(new Set([...prev, phoneKey])))
      setSupabaseCustomers((prev) => prev.loaded ? { loaded: true, rows: prev.rows.filter((item) => phoneDigits(item.phone) !== phoneKey) } : prev)
      setCustomerMemos((prev) => {
        const next = { ...prev }
        delete next[customer.phone]
        delete next[phoneKey]
        return next
      })
      if (phoneDigits(customerPhone) === phoneKey) setCustomerPhone('')
    } catch (error) {
      alertSupabaseError(error, 'Supabase 저장 중 오류가 발생했습니다.')
    }
  }
  function chooseExistingCustomer(customer) {
    const latest = data.groomingReservations.find((item) => item.phone === customer.phone) || customer
    setGroomingForm((prev) => ({ ...prev, customerType: '기존 고객', dogName: latest.dogName || '', breed: latest.breed || '시츄', guardianName: customer.guardianName, phone: customer.phone, serviceType: latest.serviceType || prev.serviceType, options: latest.options || prev.options, price: latest.price || prev.price }))
    setModal(null)
  }

  if (!loginUser) return <LoginScreen onLogin={setLoginUser} />
  const restricted = isRestrictedTab(activeTab) && !isAdmin(loginUser)

  return <main className="appShell"><aside className="sidebar"><Brand /><nav className="tabs" aria-label="업무 탭">{visibleTabs.map((tab) => <button className={activeTab === tab ? 'active' : ''} key={tab} type="button" onClick={() => setActiveTab(tab)}>{tab}</button>)}</nav></aside><section className="page"><header className="pageHeader premiumHeader"><div className="pageHeading"><p className="kicker">SUNFLOWER PUPPY HOUSE</p><h1>{pageTitle(activeTab)}</h1><span>{pageSubtitle(activeTab)}</span></div><div className="headerTools"><div className="headerPill">현재 사용자: {loginUser.name}</div><button type="button" onClick={() => { localStorage.removeItem(LOGIN_KEY); setLoginUser(null) }}>로그아웃</button></div></header>{restricted && <AccessDenied />}{!restricted && activeTab === '미용케어' && <GroomingTab filters={groomingFilters} setFilters={setGroomingFilters} rows={filteredGrooming} allRows={data.groomingReservations} setModal={setModal} customers={customers} />}{!restricted && activeTab === '입양관리' && <AdoptionTab data={data} menu={adoptionMenu} setMenu={setAdoptionMenu} setModal={setModal} completeAdoption={completeAdoption} addAdoption={addAdoption} deleteAdoptionHistory={isAdmin(loginUser) ? deleteAdoptionHistory : null} />}{!restricted && activeTab === '용품관리' && <SupplyTab form={supplyForm} setForm={setSupplyForm} addSupply={addSupply} supplies={data.supplyPurchases} vendors={data.supplyVendors || []} setModal={setModal} deleteSupply={isAdmin(loginUser) ? deleteSupply : null} />}{!restricted && activeTab === '고객관리' && <CustomerTab customers={customers} selectedCustomer={selectedCustomer} phone={customerPhone} setPhone={setCustomerPhone} history={selectedCustomerHistory} setModal={setModal} filter={customerFilter} setFilter={setCustomerFilter} query={customerQuery} setQuery={setCustomerQuery} customerMemos={customerMemos} setCustomerMemos={setCustomerMemos} deleteCustomer={isAdmin(loginUser) ? deleteCustomer : null} />}{!restricted && activeTab === '정산관리' && isAdmin(loginUser) && <LedgerTab activeTab={accountingTab} setActiveTab={setAccountingTab} form={accountingForm} setForm={setAccountingForm} addAccounting={addAccounting} entries={data.accountingEntries} settlements={filteredSettlements} receipts={data.accountingEntries.filter((item) => item.receiptAttached || item.receiptName)} todayIncome={todayIncome} todayExpense={todayExpense} monthIncome={monthIncome} monthExpense={monthExpense} todayYesulSales={todayYesulSales} todayYesulSettlement={todayYesulSettlement} monthYesulSales={monthYesulSales} monthYesulSettlement={monthYesulSettlement} filters={settlementFilters} setFilters={setSettlementFilters} setModal={setModal} />}{!restricted && activeTab === '통합데이터' && isAdmin(loginUser) && <StatsTab data={data} />}</section>{modal && <Modal modal={modal} onClose={() => setModal(null)} saveGrooming={saveGrooming} saveAdoption={saveAdoption} addAdoption={addAdoption} savePuppy={savePuppy} addPuppy={addPuppy} deletePuppy={deletePuppy} completePuppyAdoption={completePuppyAdoption} saveSupply={saveSupply} saveAccounting={saveAccounting} saveSettlement={saveSettlement} completeAdoption={completeAdoption} chooseExistingCustomer={chooseExistingCustomer} createGrooming={createGrooming} setAccountingStatus={setAccountingStatus} setAccountingSettlement={setAccountingSettlement} setSettlementStatus={setSettlementStatus} deleteGrooming={isAdmin(loginUser) ? deleteGrooming : null} deleteAdoption={deleteAdoption} deleteSupply={isAdmin(loginUser) ? deleteSupply : null} addSupplyVendor={addSupplyVendor} saveSupplyVendor={saveSupplyVendor} deleteSupplyVendor={isAdmin(loginUser) ? deleteSupplyVendor : null} activePuppies={activePuppyRows(data.puppies)} />}</main>
}
function roleLabel(role) {
  return { admin: '관리자', user: '사용자' }[role] || role
}
function pageTitle(tab) {
  return {
    '미용케어': '케어 스케줄 라운지',
    '입양관리': '퍼피 입양 살롱',
    '고객관리': '고객 케어 CRM',
    '용품관리': '샵 서플라이 아뜰리에',
    '정산관리': '프리미엄 정산 데스크',
    '통합데이터': '통합데이터 로그북',
  }[tab] || tab
}
function pageSubtitle(tab) {
  return {
    '미용케어': '오늘의 케어 일정과 예약 흐름을 한눈에 정리합니다.',
    '입양관리': '퍼피 매칭부터 입양 완료 이력까지 차분하게 관리합니다.',
    '고객관리': '보호자와 반려견의 방문 이력을 섬세하게 이어갑니다.',
    '용품관리': '거래처별 매입 흐름을 간결하게 확인합니다.',
    '정산관리': '수익과 비용, 정산 내역을 관리자 기준으로 정돈합니다.',
    '통합데이터': '미용, 입양, 고객, 회계, 매장용품 데이터를 한곳에서 확인하는 로그북입니다.',
  }[tab] || '해바라기 퍼피하우스 업무 화면입니다.'
}
function statusTone(status) {
  return { 예약대기: 'waiting', 예약확정: 'confirmed', 진행중: 'active', 진행완료: 'done', 취소: 'cancelled' }[normalizeGroomingStatus(status)] || 'waiting'
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
  return <div className="brandBlock"><img className="brandLogo" src="/favicon.png" alt="" aria-hidden="true" /><div className="brandText"><strong>해바라기</strong><span>퍼피하우스</span></div></div>
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
function GroomingTab({ filters, setFilters, rows, allRows, setModal, customers }) {
  const [view, setView] = useState('today')
  const views = [
    { key: 'today', label: '오늘 케어 일정' },
    { key: 'bookings', label: '예약 관리' },
    { key: 'calendar', label: '월간 케어 캘린더' },
  ]
  const activeRows = sortByDateTime((allRows || []).filter((item) => !isCanceledGrooming(item)))
  const todayRows = activeRows.filter((item) => item.date === today)
  const directorRows = todayRows.filter((item) => item.staff === '원장님')
  const yesulRows = todayRows.filter((item) => item.staff === '예슬님')
  const tableRows = rows.map((item) => ({ ...item, status: normalizeGroomingStatus(item.status) }))
  return <div className="stack groomingWorkspace"><div className="subTabs groomingSubTabs">{views.map((item) => <button className={view === item.key ? 'active' : ''} key={item.key} type="button" onClick={() => setView(item.key)}>{item.label}</button>)}</div>{view === 'today' && <TodayCareBoard directorRows={directorRows} yesulRows={yesulRows} setModal={setModal} />}{view === 'bookings' && <><section className="panel compactToolbar groomingToolbar"><div><h2>프리미엄 케어 예약</h2><p>신규 고객 등록과 기존 고객 재예약을 한 흐름으로 관리합니다.</p></div><button className="largeAction" type="button" onClick={() => setModal({ type: 'booking', title: '예약등록', customers })}>예약등록</button></section><section className="panel reservationPanel groomingReservationPanel"><div className="panelTitle"><h2>예약 관리</h2><span>행 클릭 시 상세/수정</span></div><div className="filterBar groomingFilterBar"><Input label="검색" value={filters.query} onChange={(value) => setFilters({ ...filters, query: value })} /><Input label="시작일" type="date" value={filters.from} onChange={(value) => setFilters({ ...filters, from: value })} /><Input label="종료일" type="date" value={filters.to} onChange={(value) => setFilters({ ...filters, to: value })} /><Select label="담당자" value={filters.staff} onChange={(value) => setFilters({ ...filters, staff: value })} options={['전체', ...staffList]} /><Select label="진행상태" value={filters.status} onChange={(value) => setFilters({ ...filters, status: value })} options={['전체', ...statusList]} /></div><DataTable rows={tableRows} columns={['dogName', 'breed', 'guardianName', 'phone', 'date', 'time', 'staff', 'serviceType', 'options', 'price', 'status', 'paymentStatus']} type="edit-grooming" setModal={setModal} /></section></>}{view === 'calendar' && <CareCalendar rows={activeRows} setModal={setModal} />}</div>
}
function TodayCareBoard({ directorRows, yesulRows, setModal }) {
  return <section className="careBoard"><CareStaffCard title="원장님 케어 일정" rows={directorRows} setModal={setModal} /><CareStaffCard title="예슬님 케어 일정" rows={yesulRows} setModal={setModal} /></section>
}
function CareStaffCard({ title, rows, setModal }) {
  return <article className="panel careStaffCard"><div className="panelTitle"><h2>{title}</h2><span>{rows.length}건</span></div><div className="careCardList">{rows.length === 0 ? <p className="empty">오늘 남은 케어 일정이 없습니다.</p> : rows.map((item) => <CareReservationCard key={item.id} item={item} setModal={setModal} />)}</div></article>
}
function CareReservationCard({ item, setModal }) {
  const status = normalizeGroomingStatus(item.status)
  return <button className={`careReservationCard compactCareCard status-${statusTone(status)}`} type="button" onClick={() => setModal({ type: 'edit-grooming', title: petLabel(item), item: { ...item, status } })}><span className="compactCareTime">{displayValue(item, 'time')}</span><strong>{displayValue(item, 'dogName')}</strong><span>{displayValue(item, 'serviceType')}</span><span>{displayValue(item, 'options')}</span><b>{displayValue(item, 'paymentStatus')}</b><i className={`statusDot status-${statusTone(status)}`} title={status} aria-label={status} /></button>
}
function CareCalendar({ rows, setModal }) {
  const [viewMonth, setViewMonth] = useState(currentMonth)
  const days = monthDays(viewMonth, rows, [])
  const weekDays = ['\uC77C', '\uC6D4', '\uD654', '\uC218', '\uBAA9', '\uAE08', '\uD1A0']
  const moveMonth = (offset) => setViewMonth((value) => shiftMonthValue(value, offset))
  return <section className="panel careCalendarPanel"><div className="calendarMonthBar"><div className="calendarMonthControls"><button type="button" onClick={() => moveMonth(-1)}>{'<'}</button><button type="button" onClick={() => setViewMonth(currentMonth)}>{'\uC624\uB298'}</button></div><strong>{formatMonthTitle(viewMonth)}</strong><div className="calendarMonthControls"><button type="button" onClick={() => moveMonth(1)}>{'>'}</button></div></div><div className="calendarWeek">{weekDays.map((day) => <span key={day}>{day}</span>)}</div><div className="calendarGrid careCalendarGrid">{days.map((day) => day.blank ? <div className="calendarBlank" key={day.key} /> : <button className="calendarDay careCalendarDay" type="button" key={day.key} onClick={() => setModal({ type: 'grooming-day-list', title: formatDateWithDay(day.date) + ' \uCF00\uC5B4 \uC608\uC57D', list: sortByDateTime(day.entries) })}><strong>{day.label}</strong>{day.entries.slice(0, 4).map((item) => <span className={`careCalendarItem ${staffClass(item.staff)}`} key={item.id}>{item.time || '-'} {item.staff || '-'} {item.dogName || '-'}</span>)}{day.entries.length > 4 && <small>{'\uC678 '}{day.entries.length - 4}{'\uAC74'}</small>}</button>)}</div></section>
}
function completedAdoptionRows(data) {
  const rows = []
  const linkedPuppyIds = new Set()
  ;(data.adoptionConsultations || []).forEach((item) => {
    if (!isCompletedAdoptionStatus(item.status)) return
    const completedDate = item.adoptionDate || item.completedDate || item.date || today
    if (item.puppyId) linkedPuppyIds.add(item.puppyId)
    const linkedPuppy = item.puppyId ? (data.puppies || []).find((puppy) => puppy.id === item.puppyId) : null
    rows.push({
      ...adoptionDisplayRow(item),
      id: 'adoption-history-' + item.id,
      dogName: item.dogName || item.name || item.preferredBreed || '-',
      breed: item.breed || item.preferredBreed || '-',
      gender: item.gender || '-',
      ageMonths: calculateAgeMonths(item.birth) || item.ageMonths || '-',
      arrival: item.arrival || linkedPuppy?.arrival || '-',
      completedDate,
      adoptionDate: completedDate,
      intakeAmount: item.intakeAmount || item.purchasePrice || linkedPuppy?.intakeAmount || linkedPuppy?.purchasePrice || 0,
      finalPrice: item.price || item.adoptionPrice || item.finalPrice || linkedPuppy?.adoptionPrice || 0,
      guardianName: item.guardianName || '-',
      phone: formatPhoneNumber(item.phone),
      region: item.region || '-',
      paymentMethod: normalizePaymentMethod(item.paymentMethod || '계좌이체'),
      consultant: replaceRole(item.consultant),
      specialNote: item.specialNote || item.memo || item.adopterMemo || '',
      sourceKind: 'adoption',
      sourceId: item.id,
    })
  })
  ;(data.puppies || []).filter(isAdoptedPuppy).forEach((puppy) => {
    if (linkedPuppyIds.has(puppy.id)) return
    rows.push({
      ...puppy,
      dogName: puppy.name || puppy.dogName || '-',
      completedDate: puppy.completedDate || today,
      adoptionDate: puppy.completedDate || today,
      intakeAmount: puppy.intakeAmount || puppy.purchasePrice || 0,
      finalPrice: puppy.adoptionPrice || puppy.finalPrice || 0,
      guardianName: puppy.guardianName || '-',
      phone: formatPhoneNumber(puppy.phone),
      region: puppy.region || '-',
      paymentMethod: normalizePaymentMethod(puppy.paymentMethod || '계좌이체'),
      status: puppy.status || '입양완료',
      specialNote: puppy.specialNote || puppy.memo || '',
      sourceKind: 'puppy',
      sourceId: puppy.id,
    })
  })
  return rows.sort((a, b) => String(b.completedDate || b.date || '').localeCompare(String(a.completedDate || a.date || '')))
}
function AdoptionTab({ data, menu, setMenu, setModal, completeAdoption, addAdoption, deleteAdoptionHistory }) {
  const profileRows = activePuppyRows(data.puppies)
  const adoptedRows = completedAdoptionRows(data)
  const matchingRows = sortByDateTime((data.adoptionConsultations || []).filter(isActiveMatchingRow)).map(adoptionDisplayRow)
  const rows = menu === adoptionMenus[0] ? matchingRows : menu === adoptionMenus[1] ? profileRows : adoptedRows
  const columns = menu === adoptionMenus[0] ? ['dogName', 'breed', 'gender', 'ageMonths', 'guardianName', 'phone', 'region', 'paymentMethod', 'price', 'adoptionDate', 'status'] : menu === adoptionMenus[1] ? ['name', 'breed', 'gender', 'ageMonths', 'arrival', 'intakeAmount', 'adoptionPrice', 'status', 'consultant'] : ['dogName', 'breed', 'gender', 'ageMonths', 'guardianName', 'phone', 'region', 'paymentMethod', 'intakeAmount', 'finalPrice', 'adoptionDate', 'status']
  const tableClass = menu === adoptionMenus[1] ? 'puppyProfilePanel' : menu === adoptionMenus[2] ? 'puppyAdoptionPanel' : ''
  return <div className="stack"><div className="subTabs">{adoptionMenus.map((item) => <button className={menu === item ? 'active' : ''} key={item} type="button" onClick={() => setMenu(item)}>{item}</button>)}</div>{menu === adoptionMenus[0] && <section className="panel compactToolbar"><div><h2>퍼피 매칭 상담</h2><p>오늘 진행할 상담과 퍼피 프로파일 연결을 관리합니다.</p></div><button className="largeAction" type="button" onClick={() => setModal({ type: 'new-adoption', title: '퍼피 매칭 상담 등록', item: { date: today, status: '신규상담', consultant: '퍼피 컨설턴트' } })}>상담 등록</button></section>}{menu === adoptionMenus[1] && <section className="panel compactToolbar"><div><h2>퍼피 프로파일</h2><p>신규 등록, 수정, 삭제, 입양완료 처리를 관리합니다.</p></div><button className="largeAction" type="button" onClick={() => setModal({ type: 'new-puppy', title: '신규 퍼피 등록', item: { status: '입소', breed: '시츄', consultant: '퍼피 컨설턴트' } })}>신규 퍼피 등록</button></section>}<section className={`panel compactPanel ${tableClass}`}><div className="panelTitle"><h2>{menu}</h2><span>{menu === adoptionMenus[0] ? '오늘 기준 진행 상담' : '행 클릭 시 팝업'}</span></div><DataTable rows={rows} columns={columns} type={menu === adoptionMenus[0] ? 'edit-adoption' : menu === adoptionMenus[2] ? 'detail' : 'edit-puppy'} setModal={setModal} extraAction={completeAdoption} onDelete={menu === adoptionMenus[2] ? deleteAdoptionHistory : null} /></section></div>
}
function SupplyTab({ form, setForm, addSupply, supplies, vendors, setModal, deleteSupply }) {
  const vendorNames = ['직접입력', ...vendors.map((item) => item.name).filter(Boolean)]
  const vendorOptions = form.vendor && !vendorNames.includes(form.vendor) ? [...vendorNames, form.vendor] : vendorNames
  const vendorRows = vendors.map((item) => ({ ...item, supplierName: item.name || item.vendor || '' }))
  return <div className="stack supplyWorkspace"><section className="panel compactToolbar"><div><h2>거래처 관리</h2><p>등록된 거래처는 매입 등록 시 바로 선택할 수 있습니다.</p></div><button className="largeAction" type="button" onClick={() => setModal({ type: 'new-supply-vendor', title: '거래처 등록', item: defaultSupplyVendor() })}>거래처 등록</button></section><form className="panel formGrid" onSubmit={addSupply}><div className="panelTitle wide"><h2>거래처/대리점 총매입가 등록</h2><span>개별 상품 재고관리 없음</span></div><Input label="매입일" type="date" value={form.date} onChange={(value) => setForm({ ...form, date: value })} /><Select label="납품업체명" value={form.vendor || '직접입력'} onChange={(value) => setForm({ ...form, vendor: value === '직접입력' ? '' : value })} options={vendorOptions} /><Select label="품목구분" value={form.itemType} onChange={(value) => setForm({ ...form, itemType: value })} options={itemTypes} /><Input label="매입내용" value={form.summary} onChange={(value) => setForm({ ...form, summary: value })} /><Input label="총매입금액" type="number" value={form.totalAmount} onChange={(value) => setForm({ ...form, totalAmount: value })} /><Select label="결제조건" value={form.paymentMethod} onChange={(value) => setForm({ ...form, paymentMethod: value })} options={supplyPaymentMethods} /><Select label="처리상태" value={form.status} onChange={(value) => setForm({ ...form, status: value })} options={processStatusList} /><ReceiptInput label="영수증 첨부" onChange={(fileName) => setForm({ ...form, receiptAttached: Boolean(fileName), receiptName: fileName })} /><button className="primaryAction" type="submit">매입 등록</button></form><section className="panel compactPanel"><div className="panelTitle"><h2>거래처 목록</h2><span>{vendors.length}곳</span></div><DataTable rows={vendorRows} columns={['supplierName', 'manager', 'phone', 'mainItem', 'paymentMethod']} type="edit-supply-vendor" setModal={setModal} onDelete={null} /></section><section className="panel"><DataTable rows={supplies} columns={['date', 'vendor', 'itemType', 'totalAmount', 'status']} type="edit-supply" setModal={setModal} onDelete={deleteSupply} /></section></div>
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
          <div className="crmSelectButton" role="button" tabIndex={0} onClick={() => setPhone(customer.phone)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setPhone(customer.phone) }}>
            {deleteCustomer && <button className="crmDeleteXButton" type="button" aria-label="고객 삭제" onClick={(event) => { event.stopPropagation(); deleteCustomer(customer) }}>{'\u00D7'}</button>}
            <strong>{customer.guardianName || '-'}</strong>
            <span>{formatPhoneNumber(customer.phone) || '-'}</span>
            <em>견명 {customer.dogName || '-'}</em>
            <div className="badgeRow crmBadges">{customer.badges.map((badge) => <i className={badgeClass(badge)} key={badge}>{badge}</i>)}</div>
          </div>
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
          <div className="tableWrap crmHistoryWrap"><table className="crmHistoryTable data-table"><thead><tr><th className={tableCellClass('date')}>날짜</th><th className={tableCellClass('type')}>구분</th><th className={tableCellClass('petName')}>견명</th><th className={tableCellClass('service')}>서비스</th><th className={tableCellClass('amount')}>금액</th><th className={tableCellClass('status')}>상태</th><th className={tableCellClass('memo')}>메모</th></tr></thead><tbody>{historyRows.map((row) => <tr key={row.id} onClick={() => setModal({ type: 'detail', title: '서비스 이력 상세', item: row.detail || row })}><td className={tableCellClass('date')}>{formatServiceHistoryDate(row.date)}</td><td className={tableCellClass('type')}>{row.type || '기타'}</td><td className={tableCellClass('petName')}>{row.petName || '-'}</td><td className={tableCellClass('service')}>{row.service || '-'}</td><td className={tableCellClass('amount')}>{formatServiceHistoryAmount(row.amount)}</td><td className={tableCellClass('status')}>{row.status || '-'}</td><td className={tableCellClass('memo')}>{row.memo || '-'}</td></tr>)}</tbody></table>{historyHasError && <p className="historyWarning">서비스 이력을 불러오는 중 일부 데이터 형식 오류가 있습니다.</p>}{historyRows.length === 0 && <p className="empty">서비스 이력이 없습니다.</p>}</div>
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
    if (item.type === '수익') current.income += moneyNumber(item.amount)
    if (item.type === '비용') current.expense += moneyNumber(item.amount)
    if (item.status === '확인필요') current.needsCheck += 1
    map.set(month, current)
  })
  return Array.from(map.values()).sort((a, b) => b.month.localeCompare(a.month)).map((item) => ({ ...item, profit: item.income - item.expense }))
}
function isDemoAccountingEntry(item) {
  return item.sourceKind === 'manual' || ['g-2', 's-1', 's-2', 'a-3', 'manual-1'].includes(item.sourceId)
}
function LedgerTab({ activeTab, setActiveTab, entries, settlements, receipts, monthIncome, monthExpense, todayYesulSales, todayYesulSettlement, monthYesulSales, monthYesulSettlement, filters, setFilters, setModal }) {
  const [selectedLedgerDate, setSelectedLedgerDate] = useState(today)
  const monthProfit = monthIncome - monthExpense
  const selectedDayRows = sortByDateTime(entries.filter((item) => item.date === selectedLedgerDate && !isDemoAccountingEntry(item)))
  const selectedIncomeView = sumAmount(selectedDayRows, (item) => item.type === '\uC218\uC775')
  const selectedExpenseView = sumAmount(selectedDayRows, (item) => item.type === '\uBE44\uC6A9')
  const monthlyRows = monthlyLedgerRows(entries)
  const unSettledCount = settlements.filter((item) => item.status !== '\uC815\uC0B0\uC644\uB8CC').length
  const moveLedgerDate = (offset) => setSelectedLedgerDate((value) => dateOffset(value, offset))
  return <div className="stack accountingStack"><div className="subTabs accountingTabs">{accountingTabs.map((tab) => <button className={activeTab === tab ? 'active' : ''} key={tab} type="button" onClick={() => setActiveTab(tab)}>{tab}</button>)}</div><section className="metricGrid accountingMetrics"><button className="summaryCard static" type="button"><span>{'\uC120\uD0DD\uC77C \uCD1D\uC218\uC775'}</span><strong className="plusAmount">+{currency(selectedIncomeView)}</strong></button><button className="summaryCard static" type="button"><span>{'\uC120\uD0DD\uC77C \uCD1D\uBE44\uC6A9'}</span><strong className="minusAmount">-{currency(selectedExpenseView)}</strong></button><button className="summaryCard static" type="button"><span>{'\uC120\uD0DD\uC77C \uC21C\uC774\uC775'}</span><strong>{currency(selectedIncomeView - selectedExpenseView)}</strong></button><button className="summaryCard static" type="button"><span>{'\uC6D4 \uC218\uC775'}</span><strong>{currency(monthIncome)}</strong></button><button className="summaryCard static" type="button"><span>{'\uC6D4 \uC21C\uC774\uC775'}</span><strong>{currency(monthProfit)}</strong></button></section>
    {activeTab === accountingTabs[0] && <section className="panel compactPanel ledgerDayPanel"><div className="ledgerDateBar"><div className="ledgerDateControls"><button type="button" onClick={() => moveLedgerDate(-1)}>{'\uC804\uB0A0'}</button><button type="button" onClick={() => setSelectedLedgerDate(today)}>{'\uC624\uB298'}</button><button type="button" onClick={() => moveLedgerDate(1)}>{'\uB2E4\uC74C\uB0A0'}</button></div><strong>{formatDateWithDay(selectedLedgerDate)}</strong><span>{'\uC790\uB3D9 \uBC18\uC601 \uB370\uC774\uD130'}</span></div>{selectedDayRows.length === 0 ? <EmptyState message={'\uC120\uD0DD\uD55C \uB0A0\uC9DC\uC758 \uC218\uC775\u00B7\uBE44\uC6A9 \uB0B4\uC5ED\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.'} /> : <DataTable rows={selectedDayRows} columns={['date', 'type', 'title', 'customerVendor', 'staff', 'amount', 'status']} type="edit-accounting" setModal={setModal} />}</section>}
    {activeTab === accountingTabs[1] && <section className="panel compactPanel"><div className="panelTitle"><h2>{accountingTabs[1]}</h2><span>{'\uC6D4 / \uCD1D\uC218\uC775 / \uCD1D\uBE44\uC6A9 / \uC21C\uC774\uC775 / \uD655\uC778\uD544\uC694'}</span></div><DataTable rows={monthlyRows} columns={['month', 'income', 'expense', 'profit', 'needsCheck']} type="detail" setModal={setModal} /></section>}
    {activeTab === accountingTabs[2] && <section className="panel compactPanel"><div className="panelTitle"><h2>{accountingTabs[2]}</h2><span>{'\uD589 \uD074\uB9AD \uC2DC \uC0C1\uC138'}</span></div><DataTable rows={entries} columns={['date', 'type', 'title', 'amount', 'status']} type="edit-accounting" setModal={setModal} /></section>}
    {activeTab === accountingTabs[3] && <section className="panel compactPanel"><div className="panelTitle"><h2>{accountingTabs[3]}</h2><span>{receipts.length}{'\uAC74'}</span></div><DataTable rows={receipts} columns={['date', 'type', 'title', 'amount', 'receiptName']} type="edit-accounting" setModal={setModal} /></section>}
    {activeTab === accountingTabs[4] && <section className="panel compactPanel"><div className="panelTitle"><h2>{accountingTabs[4]}</h2><span>{'\uACB0\uC81C\uC644\uB8CC \uBBF8\uC6A9\uB9E4\uCD9C \u00D7 60%'}</span></div><section className="metricGrid settlementMetrics"><button className="summaryCard static" type="button"><span>{'\uC624\uB298 \uC608\uC2AC\uB2D8 \uB9E4\uCD9C'}</span><strong>{currency(todayYesulSales)}</strong></button><button className="summaryCard static" type="button"><span>{'\uC624\uB298 \uC815\uC0B0\uAE08\uC561 60%'}</span><strong>{currency(todayYesulSettlement)}</strong></button><button className="summaryCard static" type="button"><span>{'\uC774\uBC88 \uB2EC \uC608\uC2AC\uB2D8 \uB9E4\uCD9C'}</span><strong>{currency(monthYesulSales)}</strong></button><button className="summaryCard static" type="button"><span>{'\uC774\uBC88 \uB2EC \uC608\uC2AC\uB2D8 \uC815\uC0B0\uAE08\uC561 60%'}</span><strong>{currency(monthYesulSettlement)}</strong></button><button className="summaryCard static" type="button"><span>{'\uBBF8\uC815\uC0B0 \uAC74\uC218'}</span><strong>{unSettledCount}</strong></button></section><div className="filterBar settlementFilter"><Input label={'\uC2DC\uC791\uC77C'} type="date" value={filters.from} onChange={(value) => setFilters({ ...filters, from: value })} /><Input label={'\uC885\uB8CC\uC77C'} type="date" value={filters.to} onChange={(value) => setFilters({ ...filters, to: value })} /><button type="button" onClick={() => setFilters({ ...filters, from: currentMonth + '-01', to: currentMonth + '-31' })}>{'\uC774\uBC88 \uB2EC \uBCF4\uAE30'}</button><button type="button" onClick={() => setFilters({ ...filters, unpaidOnly: !filters.unpaidOnly })}>{filters.unpaidOnly ? '\uC804\uCCB4 \uBCF4\uAE30' : '\uBBF8\uC815\uC0B0\uB9CC \uBCF4\uAE30'}</button></div><DataTable rows={settlements} columns={['date', 'dogName', 'guardianName', 'salesAmount', 'settlementAmount', 'status']} type="edit-settlement" setModal={setModal} /></section>}
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
  const exportRows = filteredRows.map((row) => ({ ...row, date: formatDateWithDay(row.date), amount: moneyNumber(row.amount) }))
  return <div className="stack statsAdmin"><section className="panel statsToolbar"><div><h2>통합데이터 로그북</h2><p>미용, 입양, 고객, 회계, 매장용품 데이터를 한곳에서 확인하는 로그북입니다.</p></div><button className="largeAction" type="button" onClick={() => downloadXlsx(exportRows, columns, '해바라기_통합데이터_' + todayStamp() + '.xlsx')}>엑셀 다운로드</button></section><section className="panel statsFilters"><Input label="시작일" type="date" value={filters.from} onChange={(value) => setFilters({ ...filters, from: value })} /><Input label="종료일" type="date" value={filters.to} onChange={(value) => setFilters({ ...filters, to: value })} /><Select label="구분" value={filters.category} onChange={(value) => setFilters({ ...filters, category: value })} options={categories} /><Select label="담당자" value={filters.staff} onChange={(value) => setFilters({ ...filters, staff: value })} options={staffs} /><Select label="상태" value={filters.status} onChange={(value) => setFilters({ ...filters, status: value })} options={statuses} /><Input label="검색" value={filters.query} onChange={(value) => setFilters({ ...filters, query: value })} /></section><section className="panel statsTablePanel"><div className="panelTitle"><h2>통합데이터</h2><span>{filteredRows.length} / {rows.length}건</span></div><div className="statsTableWrap"><table className="statsTable data-table"><thead><tr>{columns.map((column) => <th className={tableCellClass(column.key)} key={column.key}>{column.label}</th>)}</tr></thead><tbody>{filteredRows.map((row) => <tr key={row.id}>{columns.map((column) => <td className={tableCellClass(column.key)} key={column.key}>{column.key === 'date' ? formatDateWithDay(row.date) : column.key === 'amount' ? currency(row.amount) : column.key === 'phone' ? (formatPhoneNumber(row.phone) || '-') : row[column.key] || '-'}</td>)}</tr>)}</tbody></table>{filteredRows.length === 0 && <p className="empty">조건에 맞는 데이터가 없습니다.</p>}</div></section></div>
}
function EmptyState({ message }) {
  return <div className="emptyState"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 8h15l7 7v25H14z" /><path d="M29 8v8h7M19 24h12M19 30h12M19 36h8" /></svg><p>{message}</p></div>
}
function DataTable({ rows, columns, type, setModal, extraAction, onDelete }) {
  return <div className="tableWrap"><table className="data-table"><thead><tr>{columns.map((column) => <th className={tableCellClass(column)} key={column}>{columnLabels[column] || column}</th>)}{onDelete && <th className="actionColumn">삭제</th>}</tr></thead><tbody>{rows.map((row) => <tr key={row.id} onClick={() => setModal({ type, title: petLabel(row), item: row, extraAction })}>{columns.map((column) => <td className={tableCellClass(column)} key={column}>{displayValue(row, column)}</td>)}{onDelete && <td className="actionCell"><button className="rowDeleteButton" type="button" onClick={(event) => { event.stopPropagation(); onDelete(row) }}>삭제</button></td>}</tr>)}</tbody></table>{rows.length === 0 && <p className="empty">표시할 데이터가 없습니다.</p>}</div>
}
function isNumberColumn(column) {
  return ['price', 'amount', 'totalAmount', 'salesAmount', 'settlementAmount', 'income', 'expense', 'profit', 'finalPrice', 'intakeAmount', 'adoptionPrice', 'budget', 'ageMonths', 'quantity', 'count', 'adoptionAmount', 'purchasePrice'].includes(column)
}
function isDateColumn(column) {
  return ['date', 'arrival', 'completedDate', 'visitDate', 'adoptionDate', 'createdAt', 'updatedAt'].includes(column)
}
function isPhoneColumn(column) {
  return isPhoneField(column, columnLabels[column])
}
function tableCellClass(column) {
  return ['col-' + column, isNumberColumn(column) ? 'number num' : '', isDateColumn(column) ? 'date' : '', isPhoneColumn(column) ? 'phone' : ''].filter(Boolean).join(' ')
}
function formatDateWithDay(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return value || '-'
  const day = ['일', '월', '화', '수', '목', '금', '토'][new Date(value + 'T00:00:00').getDay()]
  return value + ' (' + day + ')'
}
function displayValue(row, column) {
  const moneyColumns = ['price', 'amount', 'totalAmount', 'salesAmount', 'settlementAmount', 'income', 'expense', 'profit', 'finalPrice', 'intakeAmount', 'adoptionPrice', 'budget', 'purchasePrice', 'adoptionAmount']
  if (moneyColumns.includes(column)) return formatCurrency(row[column]) || '-'
  if (column === 'ageMonths') return calculateAgeMonths(row?.birth) || missingText(row?.ageMonths)
  if (column === 'date' || column === 'completedDate' || column === 'arrival' || column === 'visitDate' || column === 'adoptionDate') return formatDateWithDay(row[column])
  if (isPhoneField(column, columnLabels[column])) return formatPhoneNumber(row[column]) || '-'
  if (column === 'receiptAttached') return row.receiptAttached ? '첨부' : '미첨부'
  if (column === 'consultant') return replaceRole(row[column]) || '-'
  const value = row?.[column]
  return value === undefined || value === null || value === '' || String(value) === 'NaN' || String(value) === 'undefined' || String(value) === 'null' ? '-' : value
}
function detailDisplayValue(key, value) {
  const moneyColumns = ['price', 'amount', 'totalAmount', 'intakeAmount', 'adoptionPrice', 'finalPrice', 'budget', 'purchasePrice', 'adoptionAmount', 'salesAmount', 'settlementAmount']
  if (moneyColumns.includes(key)) return formatCurrency(value) || '-'
  if (key === 'date' || key === 'completedDate' || key === 'arrival' || key === 'visitDate' || key === 'adoptionDate') return formatDateWithDay(value)
  if (isPhoneField(key, columnLabels[key])) return formatPhoneNumber(value) || '-'
  if (key === 'consultant') return replaceRole(value) || '-'
  return value === undefined || value === null || value === '' || String(value) === 'NaN' || String(value) === 'undefined' || String(value) === 'null' ? '-' : String(value)
}
const columnLabels = { region: '거주지역', preferredBreed: '희망 견종', preferredGender: '희망 성별', budget: '희망 예산', visitDate: '방문 가능일', route: '상담 경로', contractProgress: '계약 진행 여부', adoptionDate: '입양일', puppyId: '선택 퍼피ID', manager: '담당자명', mainItem: '주 취급품목', dogName: '견명', name: '견명', petName: '견명', ownerName: '보호자', type: '구분', service: '서비스', breed: '견종', guardianName: '보호자', phone: '전화번호', date: '날짜', time: '예약시간', serviceType: '서비스유형', options: '추가옵션', price: '가격', staff: '담당자', status: '상태', paymentStatus: '결제상태', consultant: '담당자', gender: '성별', arrival: '입소일', outgoing: '출고일', vendor: '납품업체명', supplierName: '거래처명', vendorName: '거래처명', supplier_name: '거래처명', vendor_name: '거래처명', managerName: '담당자명', manager_name: '담당자명', mainItems: '주 취급품목', main_items: '주 취급품목', paymentMethod: '결제조건', payment_method: '결제조건', puppyName: '견명', ownerName: '보호자명', ownerPhone: '전화번호', purchasePrice: '도입가', createdAt: '등록일', updatedAt: '수정일', created_at: '등록일', updated_at: '수정일', itemType: '품목구분', totalAmount: '총매입금액', type: '구분', amount: '금액', title: '항목명', customerVendor: '고객/거래처', receiptAttached: '영수증', receiptName: '영수증명', salesAmount: '미용매출', settlementAmount: '정산금액', month: '월', income: '총수익', expense: '총비용', profit: '순이익', needsCheck: '확인필요', ageMonths: '개월수', intakeAmount: '도입가', completedDate: '입양완료일', finalPrice: '입양가', specialNote: '특이사항', profileNo: '관리번호', birth: '생년월일', coatColor: '모색', source: '입소처', adoptionPrice: '입양가', healthStatus: '건강상태', vaccination: '접종정보', photoName: '사진첨부' }
function isMoneyField(fieldKey, label, type) {
  return type === 'number' || ['가격', '금액', '입양가', '도입가', '총매입금액', '희망 예산', '미용매출', '정산금액'].some((word) => String(label || '').includes(word)) || ['price', 'amount', 'totalAmount', 'budget', 'finalPrice', 'intakeAmount', 'adoptionPrice', 'purchasePrice', 'adoptionAmount', 'salesAmount', 'settlementAmount'].includes(fieldKey)
}
function Input({ label, value, onChange, type = 'text', fieldKey = '' }) {
  const phoneField = isPhoneField(fieldKey, label)
  const moneyField = !phoneField && isMoneyField(fieldKey, label, type)
  const display = phoneField ? formatPhoneNumber(value) : moneyField ? formatCurrency(value) : (value ?? '')
  function handleChange(event) {
    if (moneyField) {
      onChange(event.target.value.replace(/[^0-9]/g, ''))
      return
    }
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
        if (/\d/.test(formatted[nextCursor])) seenDigits += 1
        nextCursor += 1
      }
      try { event.target.setSelectionRange(nextCursor, nextCursor) } catch {}
    })
  }
  return <label className="field"><span>{label}</span><input type={phoneField || moneyField ? 'tel' : type} inputMode={phoneField || moneyField ? 'numeric' : undefined} maxLength={phoneField ? 13 : undefined} value={display} onChange={handleChange} /></label>
}
function Select({ label, value, onChange, options }) {
  const safeOptions = Array.from(new Set([...(options || []), value].filter((option) => option !== undefined && option !== null && option !== '')))
  return <label className="field"><span>{label}</span><select value={value ?? ''} onChange={(event) => onChange(event.target.value)}>{safeOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
}
function ChoiceSelect({ label, value, onChange, options }) {
  const safeOptions = Array.from(new Set([...(options || []), value].filter((option) => option !== undefined && option !== null && option !== '')))
  return <div className="field choiceSelectField"><span>{label}</span><div className="optionButtonGroup singleChoiceGroup">{safeOptions.map((option) => <button key={option} className={value === option ? 'selected' : ''} type="button" onClick={() => onChange(option)}>{option}</button>)}</div></div>
}
function MultiSelect({ label, value, onChange, options }) {
  const selected = new Set(splitAdditionalOptions(value))
  function toggle(option) {
    const next = new Set(selected)
    if (next.has(option)) next.delete(option)
    else next.add(option)
    onChange(normalizeAdditionalOptions(Array.from(next)))
  }
  return <div className="field multiSelectField"><span>{label}</span><div className="multiSelectOptions">{options.map((option) => <button key={option} className={selected.has(option) ? 'selected' : ''} type="button" onClick={() => toggle(option)}>{option}</button>)}</div></div>
}
function ReceiptInput({ label, onChange }) { return <label className="field"><span>{label}</span><input type="file" onChange={(event) => onChange(event.target.files?.[0]?.name || '')} /></label> }
function Modal(props) {
  const { modal, onClose } = props
  return <div className="modalBackdrop" role="presentation" onMouseDown={onClose}><section className="modalCard" role="dialog" aria-modal="true" aria-label={modal.title} onMouseDown={(event) => event.stopPropagation()}><div className="modalHeader"><h2>{modal.title}</h2><button type="button" onClick={onClose}>닫기</button></div><ModalBody {...props} /></section></div>
}
function ModalBody({ modal, saveGrooming, saveAdoption, addAdoption, savePuppy, addPuppy, deletePuppy, completePuppyAdoption, saveSupply, saveAccounting, saveSettlement, completeAdoption, chooseExistingCustomer, createGrooming, setAccountingStatus, setAccountingSettlement, setSettlementStatus, deleteGrooming, deleteAdoption, deleteSupply, addSupplyVendor, saveSupplyVendor, deleteSupplyVendor, activePuppies }) {
  const [draft, setDraft] = useState(modal.item || {})
  if (modal.type === 'booking') return <BookingFlow customers={modal.customers || []} createGrooming={createGrooming} chooseExistingCustomer={chooseExistingCustomer} />
  if (modal.type === 'list') return <div className="modalList">{modal.list.length === 0 ? <p className="empty">표시할 데이터가 없습니다.</p> : sortByDateTime(modal.list).map((item) => <div className="modalLine" key={item.id}><strong>{petLabel(item)}</strong><span>{formatDateWithDay(item.date)} · {item.time || item.status} · {item.staff || item.consultant || ''}</span></div>)}</div>
  if (modal.type === 'grooming-day-list') return <div className="modalList careDayModal">{sortByDateTime((modal.list || []).filter((item) => !isCanceledGrooming(item))).length === 0 ? <p className="empty">표시할 예약이 없습니다.</p> : sortByDateTime((modal.list || []).filter((item) => !isCanceledGrooming(item))).map((item) => <div className="modalLine careDayLine" key={item.id}><div><strong>{item.time || '-'} · {item.dogName || '-'}</strong><span>{item.breed || '-'} · {item.guardianName || '보호자 미등록'} · {item.serviceType || '-'} · {item.options || '-'}</span></div><div className="careDayMeta"><i className={`staffBadge ${staffClass(item.staff)}`}>{item.staff || '-'}</i><b>{currency(item.price)}</b><em>{normalizeGroomingStatus(item.status)}</em></div></div>)}</div>
  if (modal.type === 'choose-customer') return <div className="modalList">{modal.customers.map((customer) => <button className="modalLine" type="button" key={customer.phone} onClick={() => chooseExistingCustomer(customer)}><strong>{customer.guardianName} · {customer.dogName}</strong><span>{formatPhoneNumber(customer.phone)} · 기존 고객 재예약</span></button>)}</div>
  if (modal.type === 'edit-grooming') return <GroomingEditForm draft={draft} setDraft={setDraft} onSave={saveGrooming} onDelete={deleteGrooming} />
  if (modal.type === 'new-adoption') return <AdoptionMatchForm draft={draft} setDraft={setDraft} puppies={activePuppies || []} onSave={() => addAdoption(draft)} onComplete={(next) => addAdoption(next || draft)} />
  if (modal.type === 'edit-adoption') return <AdoptionMatchForm draft={draft} setDraft={setDraft} puppies={activePuppies || []} onSave={() => saveAdoption(draft)} onDelete={() => deleteAdoption(draft)} onComplete={(next) => completeAdoption(next || draft)} />
  if (modal.type === 'new-puppy') return <EditForm draft={draft} setDraft={setDraft} fields={puppyCreateFields} onSave={() => addPuppy(draft)} />
  if (modal.type === 'edit-puppy') return <EditForm draft={draft} setDraft={setDraft} fields={puppyFields} onSave={() => savePuppy(draft)} onDelete={() => deletePuppy(draft)} extra={<><button className="primaryAction" type="button" onClick={() => completePuppyAdoption(draft)}>입양완료 처리</button><button className="primaryAction" type="button" onClick={() => savePuppy({ ...draft, status: '확인필요' })}>확인필요 처리</button></>} />
  if (modal.type === 'edit-supply') return <EditForm draft={draft} setDraft={setDraft} fields={supplyFields} onSave={() => saveSupply(draft)} onDelete={deleteSupply ? () => deleteSupply(draft) : null} />
  if (modal.type === 'new-supply-vendor') return <EditForm draft={draft} setDraft={setDraft} fields={supplyVendorFields} onSave={() => addSupplyVendor(draft)} />
  if (modal.type === 'edit-supply-vendor') return <EditForm draft={draft} setDraft={setDraft} fields={supplyVendorFields} onSave={() => saveSupplyVendor(draft)} onDelete={deleteSupplyVendor ? () => deleteSupplyVendor(draft) : null} />
  if (modal.type === 'edit-settlement') return <EditForm draft={draft} setDraft={setDraft} fields={settlementFields} onSave={() => saveSettlement(draft)} extra={<button className="primaryAction" type="button" onClick={() => setSettlementStatus(draft.id, '정산완료')}>정산완료</button>} />
  if (modal.type === 'edit-accounting') return <EditForm draft={draft} setDraft={setDraft} fields={accountingFields} onSave={() => saveAccounting(draft)} extra={<><button className="primaryAction" type="button" onClick={() => setAccountingStatus(draft.id, '처리완료')}>처리완료</button><button className="primaryAction" type="button" onClick={() => setAccountingStatus(draft.id, '확인필요')}>확인필요</button>{draft.settlementStatus !== '-' && <button className="primaryAction" type="button" onClick={() => setAccountingSettlement(draft.id, '정산완료')}>정산완료</button>}</>} />
  return <div className="detailGrid">{Object.entries(modal.item || {}).filter(([key]) => key !== 'id').map(([key, value]) => <div key={key}><dt>{columnLabels[key] || key}</dt><dd>{detailDisplayValue(key, value)}</dd></div>)}</div>
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
  return <div className="bookingFlow"><div className="detailGrid"><Input label="예약날짜" type="date" value={reservation.date} onChange={(value) => setReservation({ ...reservation, date: value })} /><Select label="예약시간" value={reservation.time} onChange={(value) => setReservation({ ...reservation, time: value })} options={timeOptions} /><Select label="서비스유형" value={reservation.serviceType} onChange={(value) => setReservation({ ...reservation, serviceType: value })} options={serviceTypes} /><Select label="추가옵션" value={reservation.options} onChange={(value) => setReservation({ ...reservation, options: value })} options={additionalOptions} /><Input label="가격" type="number" value={reservation.price} onChange={(value) => setReservation({ ...reservation, price: value })} /><Select label="담당자" value={reservation.staff} onChange={(value) => setReservation({ ...reservation, staff: value })} options={staffList} /><Select label="진행상태" value={reservation.status} onChange={(value) => setReservation({ ...reservation, status: value })} options={statusList} /><Select label="결제상태" value={reservation.paymentStatus} onChange={(value) => setReservation({ ...reservation, paymentStatus: value })} options={paymentStatusList} /><Input label="특이사항" value={reservation.memo} onChange={(value) => setReservation({ ...reservation, memo: value })} /></div><div className="modalActions"><button type="button" onClick={() => setStep('type')}>처음으로</button><button className="primaryAction" type="button" onClick={submitReservation}>예약 저장</button></div></div>
}

function GroomingEditForm({ draft, setDraft, onSave, onDelete }) {
  const [cancelStep, setCancelStep] = useState(draft.status === '취소')
  const [cancelChoice, setCancelChoice] = useState('change')
  const [changeDate, setChangeDate] = useState(draft.date || today)
  const [changeTime, setChangeTime] = useState(draft.time || '10:00')
  const [cancelMemo, setCancelMemo] = useState('')
  const normalizedStatus = normalizeGroomingStatus(draft.status)
  const handleStatus = (value) => {
    setDraft({ ...draft, status: value })
    setCancelStep(value === '취소')
  }
  const quickSave = (patch) => {
    const next = { ...draft, ...patch }
    setDraft(next)
    onSave({ ...next, phone: formatPhoneNumber(next.phone), status: normalizeGroomingStatus(next.status) })
  }
  const saveCancelFlow = () => {
    if (cancelChoice === 'change') {
      onSave({ ...draft, date: changeDate, time: changeTime, status: '예약확정', memo: appendMemo(draft.memo, '기존 예약 취소 후 날짜/시간 변경') })
      return
    }
    onSave({ ...draft, status: '취소', memo: appendMemo(draft.memo, cancelMemo || '취소 처리') })
  }
  return <div className="editArea groomingQuickEdit"><section className="quickStatusPanel"><h3>진행현황</h3><div className="quickButtonGroup">{statusList.map((status) => <button className={normalizedStatus === status ? 'selected' : ''} key={status} type="button" onClick={() => quickSave({ status })}>{status}</button>)}</div></section><div className="detailGrid">{groomingFields.map((field) => field.key === 'status' ? <Select key={field.key} label={field.label} value={normalizedStatus} onChange={handleStatus} options={field.options} /> : field.options ? <Select key={field.key} label={field.label} value={draft[field.key]} onChange={(value) => setDraft({ ...draft, [field.key]: value })} options={field.options} /> : <Input key={field.key} fieldKey={field.key} label={field.label} type={field.type || 'text'} value={draft[field.key]} onChange={(value) => setDraft({ ...draft, [field.key]: isPhoneField(field.key, field.label) ? formatPhoneNumber(value) : value })} />)}</div>{cancelStep && <section className="cancelPanel"><h3>예약 변경 또는 취소 처리</h3><div className="choiceGrid compactChoice"><button className={cancelChoice === 'change' ? 'selected' : ''} type="button" onClick={() => setCancelChoice('change')}><strong>예약 날짜/시간 변경</strong></button><button className={cancelChoice === 'cancel' ? 'selected' : ''} type="button" onClick={() => setCancelChoice('cancel')}><strong>취소 처리</strong></button></div>{cancelChoice === 'change' ? <div className="detailGrid"><Input label="변경할 예약날짜" type="date" value={changeDate} onChange={setChangeDate} /><Select label="변경할 예약시간" value={changeTime} onChange={setChangeTime} options={timeOptions} /></div> : <Input label="취소 메모" value={cancelMemo} onChange={setCancelMemo} />}</section>}<section className="quickStatusPanel paymentQuickPanel"><h3>결제현황</h3><div className="quickButtonGroup paymentButtons">{paymentStatusList.map((status) => <button className={draft.paymentStatus === status ? 'selected' : ''} key={status} type="button" onClick={() => quickSave({ paymentStatus: status })}>{status}</button>)}</div></section><div className="modalActions">{onDelete && <button className="primaryAction dangerAction" type="button" onClick={() => onDelete(draft.id)}>삭제</button>}{cancelStep ? <button className="primaryAction" type="button" onClick={saveCancelFlow}>저장</button> : <button className="primaryAction" type="button" onClick={() => onSave({ ...draft, phone: formatPhoneNumber(draft.phone), status: normalizeGroomingStatus(draft.status) })}>저장</button>}</div></div>
}
function AdoptionMatchForm({ draft, setDraft, puppies, onSave, onDelete, onComplete }) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const selectedPuppy = puppies.find((puppy) => puppy.id === draft.puppyId) || null
  const dogBirth = draft.birth || selectedPuppy?.birth || ''
  const dogInfo = {
    dogName: draft.dogName || selectedPuppy?.name || '-',
    breed: draft.breed || selectedPuppy?.breed || '-',
    gender: draft.gender || selectedPuppy?.gender || '-',
    ageMonths: calculateAgeMonths(dogBirth) || draft.ageMonths || selectedPuppy?.ageMonths || '-',
    price: draft.price || selectedPuppy?.adoptionPrice || 0,
  }
  function choosePuppy(puppy) {
    setDraft({
      ...draft,
      puppyId: puppy.id,
      profileNo: puppy.profileNo,
      dogName: puppy.name || puppy.dogName || '',
      breed: puppy.breed || '',
      gender: puppy.gender || '',
      birth: puppy.birth || '',
      ageMonths: calculateAgeMonths(puppy.birth) || '',
      arrival: puppy.arrival || '',
      price: puppy.adoptionPrice || puppy.finalPrice || draft.price || 0,
      intakeAmount: puppy.intakeAmount || puppy.purchasePrice || 0,
      consultant: draft.consultant || puppy.consultant || '퍼피 컨설턴트',
    })
    setPickerOpen(false)
  }
  function completeNow() {
    const next = { ...draft, phone: formatPhoneNumber(draft.phone), status: '입양완료', adoptionDate: draft.adoptionDate || draft.date || today, date: draft.adoptionDate || draft.date || today }
    if (!next.puppyId) {
      window.alert('강아지를 선택해주세요.')
      return
    }
    if (!next.guardianName || !phoneDigits(next.phone) || !moneyNumber(next.price)) {
      window.alert('입양자 정보와 입양금액을 입력해주세요.')
      return
    }
    if (!window.confirm('입양완료 처리하시겠습니까?')) return
    onComplete(next)
  }
  return <div className="editArea adoptionMatchForm"><section className="adoptionDogInfo"><div className="panelTitle"><h3>강아지 정보</h3><button className="primaryAction" type="button" onClick={() => setPickerOpen(true)}>강아지 선택</button></div><div className="dogInfoGrid"><InfoCard label="견명" value={displayValue(dogInfo, 'dogName')} /><InfoCard label="견종" value={displayValue(dogInfo, 'breed')} /><InfoCard label="개월수" value={displayValue(dogInfo, 'ageMonths')} /><InfoCard label="성별" value={displayValue(dogInfo, 'gender')} /><InfoCard label="입양가" value={displayValue(dogInfo, 'price')} /></div>{pickerOpen && <div className="innerPickerBackdrop" role="presentation" onMouseDown={() => setPickerOpen(false)}><section className="innerPickerCard" role="dialog" aria-modal="true" aria-label="강아지 선택" onMouseDown={(event) => event.stopPropagation()}><div className="panelTitle"><h3>강아지 선택</h3><button type="button" onClick={() => setPickerOpen(false)}>닫기</button></div><div className="tableWrap puppySelectTableWrap"><table className="puppySelectTable data-table"><thead><tr><th>견명</th><th>견종</th><th>개월수</th><th>성별</th><th>입양가</th><th>특징</th></tr></thead><tbody>{puppies.map((puppy) => <tr key={puppy.id} onClick={() => choosePuppy(puppy)}><td>{displayValue(puppy, 'name')}</td><td>{displayValue(puppy, 'breed')}</td><td className="number">{displayValue(puppy, 'ageMonths')}</td><td>{displayValue(puppy, 'gender')}</td><td className="number">{displayValue(puppy, 'adoptionPrice')}</td><td>{missingText(puppy.memo || puppy.healthStatus || puppy.coatColor)}</td></tr>)}</tbody></table>{puppies.length === 0 && <p className="empty">선택 가능한 퍼피가 없습니다.</p>}</div></section></div>}</section><section className="adoptionOwnerInfo"><h3>입양자 정보</h3><div className="detailGrid"><Input label="보호자 이름" value={draft.guardianName} onChange={(value) => setDraft({ ...draft, guardianName: value })} /><Input label="전화번호" value={draft.phone} onChange={(value) => setDraft({ ...draft, phone: formatPhoneNumber(value) })} /><Input label="거주지역" value={draft.region} onChange={(value) => setDraft({ ...draft, region: value })} /><Select label="결제조건" value={draft.paymentMethod || '계좌이체'} onChange={(value) => setDraft({ ...draft, paymentMethod: value })} options={supplyPaymentMethods} /><Input label="입양금액" type="number" value={draft.price} onChange={(value) => setDraft({ ...draft, price: value })} /><Input label="입양일" type="date" value={draft.adoptionDate || draft.date || today} onChange={(value) => setDraft({ ...draft, adoptionDate: value, date: value })} /><label className="field textAreaField"><span>특이사항</span><textarea value={draft.specialNote || ''} onChange={(event) => setDraft({ ...draft, specialNote: event.target.value })} /></label></div></section><div className="modalActions">{onComplete && <button className="primaryAction" type="button" onClick={completeNow}>입양완료</button>}{onDelete && <button className="primaryAction dangerAction" type="button" onClick={onDelete}>삭제</button>}<button className="primaryAction" type="button" onClick={() => onSave({ ...draft, phone: formatPhoneNumber(draft.phone), specialNote: draft.specialNote || '' })}>저장</button></div></div>
}
function EditForm({ draft, setDraft, fields, onSave, extra, onDelete }) {
  return <div className="editArea"><div className="detailGrid">{fields.map((field) => field.multiple ? <MultiSelect key={field.key} label={field.label} value={draft[field.key]} onChange={(value) => setDraft({ ...draft, [field.key]: value })} options={field.options} /> : field.options ? <Select key={field.key} label={field.label} value={draft[field.key]} onChange={(value) => setDraft({ ...draft, [field.key]: value })} options={field.options} /> : field.type === 'file' ? <ReceiptInput key={field.key} label={field.label} onChange={(fileName) => field.key === 'photoUpload' ? setDraft({ ...draft, photoName: fileName }) : setDraft({ ...draft, receiptAttached: Boolean(fileName), receiptName: fileName })} /> : <Input key={field.key} fieldKey={field.key} label={field.label} type={field.type || 'text'} value={draft[field.key]} onChange={(value) => setDraft({ ...draft, [field.key]: isPhoneField(field.key, field.label) ? formatPhoneNumber(value) : value })} />)}</div><div className="modalActions"><button type="button">수정</button>{extra}{onDelete && <button className="primaryAction dangerAction" type="button" onClick={onDelete}>삭제</button>}<button className="primaryAction" type="button" onClick={onSave}>저장</button></div></div>
}
const groomingFields = [{ key: 'dogName', label: '견명' }, { key: 'breed', label: '견종' }, { key: 'guardianName', label: '보호자 이름' }, { key: 'phone', label: '전화번호' }, { key: 'date', label: '예약날짜', type: 'date' }, { key: 'time', label: '예약시간', options: timeOptions }, { key: 'serviceType', label: '서비스유형', options: serviceTypes }, { key: 'options', label: '추가옵션', options: additionalOptions }, { key: 'price', label: '가격', type: 'number' }, { key: 'staff', label: '담당자', options: staffList }, { key: 'status', label: '진행상태', options: statusList }, { key: 'paymentStatus', label: '결제상태', options: paymentStatusList }, { key: 'paymentMethod', label: '결제조건' }, { key: 'memo', label: '메모' }]
const puppyCreateFields = [{ key: 'arrival', label: '입소일', type: 'date' }, { key: 'name', label: '견명' }, { key: 'breed', label: '견종' }, { key: 'gender', label: '성별', options: genderOptions }, { key: 'birth', label: '생년월일', type: 'date' }, { key: 'coatColor', label: '모색' }, { key: 'source', label: '입소처' }, { key: 'intakeAmount', label: '도입가', type: 'number' }, { key: 'adoptionPrice', label: '입양가', type: 'number' }, { key: 'status', label: '현재상태', options: puppyStatusList }, { key: 'healthStatus', label: '건강상태' }, { key: 'vaccination', label: '접종정보' }, { key: 'memo', label: '특이사항' }, { key: 'photoUpload', label: '사진첨부', type: 'file' }]
const puppyFields = [{ key: 'profileNo', label: '관리번호' }, { key: 'arrival', label: '입소일', type: 'date' }, { key: 'name', label: '견명' }, { key: 'breed', label: '견종' }, { key: 'gender', label: '성별', options: genderOptions }, { key: 'birth', label: '생년월일', type: 'date' }, { key: 'coatColor', label: '모색' }, { key: 'source', label: '입소처' }, { key: 'intakeAmount', label: '도입가', type: 'number' }, { key: 'adoptionPrice', label: '입양가', type: 'number' }, { key: 'status', label: '현재상태', options: puppyStatusList }, { key: 'healthStatus', label: '건강상태' }, { key: 'vaccination', label: '접종정보' }, { key: 'guardianName', label: '보호자 이름' }, { key: 'phone', label: '보호자 전화번호' }, { key: 'consultant', label: '담당자' }, { key: 'completedDate', label: '입양완료일', type: 'date' }, { key: 'photoUpload', label: '사진첨부', type: 'file' }, { key: 'memo', label: '특이사항' }]
const supplyFields = [{ key: 'date', label: '매입일', type: 'date' }, { key: 'vendor', label: '납품업체명' }, { key: 'itemType', label: '품목구분', options: itemTypes }, { key: 'summary', label: '매입내용' }, { key: 'totalAmount', label: '총매입금액', type: 'number' }, { key: 'paymentMethod', label: '결제조건', options: supplyPaymentMethods }, { key: 'status', label: '처리상태', options: processStatusList }, { key: 'receiptName', label: '영수증명' }, { key: 'receiptUpload', label: '영수증 첨부', type: 'file' }, { key: 'memo', label: '메모' }]
const supplyVendorFields = [{ key: 'name', label: '거래처명' }, { key: 'manager', label: '담당자명' }, { key: 'phone', label: '전화번호' }, { key: 'mainItem', label: '주 취급품목', options: itemTypes }, { key: 'paymentMethod', label: '결제조건', options: supplyPaymentMethods }, { key: 'memo', label: '메모' }]
const accountingFields = [{ key: 'date', label: '날짜', type: 'date' }, { key: 'type', label: '구분', options: ['수익', '비용'] }, { key: 'title', label: '항목명' }, { key: 'customerVendor', label: '고객/거래처' }, { key: 'dogName', label: '견명' }, { key: 'guardianName', label: '보호자 이름' }, { key: 'staff', label: '담당자' }, { key: 'amount', label: '금액', type: 'number' }, { key: 'paymentMethod', label: '결제조건' }, { key: 'status', label: '처리상태', options: processStatusList }, { key: 'settlementStatus', label: '정산상태', options: ['-', ...settlementStatusList] }, { key: 'receiptName', label: '영수증명' }, { key: 'receiptUpload', label: '영수증 첨부', type: 'file' }, { key: 'memo', label: '메모' }]
const settlementFields = [{ key: 'date', label: '날짜', type: 'date' }, { key: 'dogName', label: '견명' }, { key: 'guardianName', label: '보호자 이름' }, { key: 'salesAmount', label: '미용매출', type: 'number' }, { key: 'settlementAmount', label: '정산금액', type: 'number' }, { key: 'status', label: '정산상태', options: settlementStatusList }, { key: 'memo', label: '메모' }]

export default App
