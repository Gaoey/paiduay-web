// components/FAQ.tsx

import React, { ReactNode } from 'react'
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import UserLayout from 'src/layouts/UserLayout'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

interface FAQItemProps {
  question: string
  answer: string
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
      <Typography>{question}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography>{answer}</Typography>
    </AccordionDetails>
  </Accordion>
)

export default function FAQ() {
  return (
    <ApexChartWrapper>
      <Box sx={{ margin: '20px', textAlign: 'center' }}>
        <Typography variant='h4' gutterBottom>
          คำถามที่พบบ่อย
        </Typography>

        {/* List of FAQs */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box>
            <FAQItem
              question='ฉันสามารถจองทริปได้อย่างไร?'
              answer='คุณสามารถค้นหาและจองทริปได้โดยเลือกจากทริปที่มีอยู่บนเว็บไซต์ของเราในหน้า trip list'
            />
            <FAQItem
              question='ฉันสามารถสร้างทริปของฉันเองได้อย่างไร?'
              answer="หลังจากที่คุณเข้าสู่ระบบ, ไปที่หน้า 'สร้างทริป' และกรอกรายละเอียดตามที่ระบบขอ"
            />
            <FAQItem
              question='ฉันจะจัดการข้อมูลส่วนบุคคลของฉันได้อย่างไร?'
              answer='คุณสามารถจัดการข้อมูลส่วนบุคคลของคุณโดยติดต่อเราที่ chaiyaporn.chi@log21ruby.com'
            />
            <FAQItem
              question='ค่าใช้จ่ายในการจองทริปครอบคลุมอะไรบ้าง?'
              answer='ค่าใช้จ่ายจะครอบคลุมทุกสิ่งที่ระบุไว้ในรายละเอียดทริป ซึ่งอาจรวมถึงที่พัก, การเดินทาง, และกิจกรรมต่างๆ โปรดดูรายละเอียดใน trip detail และถ้ามีคำถามสามารถติดต่อโดยตรงกับทาง ทริปลีดเดอร์ได้เลย'
            />

            <FAQItem
              question='ฉันสามารถยกเลิกการจองและขอคืนเงินได้หรือไม่?'
              answer='คุณสามารถยกเลิกการจองได้ตามนโยบายการยกเลิกของทางทริปลีดเดอร์ในแต่ละทริป โปรดดูรายละเอียดใน trip detail ที่คุณต้องการจะจอง'
            />

            <FAQItem
              question='ฉันสามารถแก้ไขข้อมูลการจองได้หลังจากทำการจองแล้วหรือไม่?'
              answer='ใช่ คุณสามารถแก้ไขข้อมูลการจองของคุณได้จากหน้าการจัดการการจอง'
            />

            <FAQItem
              question='ฉันจะทราบได้อย่างไรว่าทริปที่ฉันจองได้รับการยืนยัน?'
              answer='คุณจะได้รับอีเมลยืนยันหลังจากการจองของคุณสำเร็จ คุณยังสามารถตรวจสอบสถานะการจองได้ในหน้าโปรไฟล์ของคุณ'
            />
          </Box>
        </Box>
      </Box>
    </ApexChartWrapper>
  )
}

FAQ.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>
