// components/TermsAndConditions.tsx

import React from 'react'
import { Box, Typography } from '@mui/material'

const TermsAndConditions: React.FC = () => {
  return (
    <Box sx={{ margin: '20px', maxWidth: '1600px' }}>
      <Typography variant='h4' gutterBottom>
        เงื่อนไขและข้อตกลงสำหรับ https://paiduay.com
      </Typography>
      <Typography paragraph>
        ยินดีต้อนรับสู่ https://paiduay.com
        เงื่อนไขและข้อตกลงเหล่านี้กำหนดกฎเกณฑ์และข้อบังคับสำหรับการใช้งานเว็บไซต์ของ LOG21RUBY CO., LTD. ซึ่งตั้งอยู่ที่
        https://paiduay.com
      </Typography>
      <Typography paragraph>
        การเข้าถึงเว็บไซต์นี้ถือว่าคุณยอมรับเงื่อนไขและข้อตกลงเหล่านี้อย่างเต็มที่
        หากคุณไม่เห็นด้วยกับเงื่อนไขและข้อตกลงทั้งหมดที่ระบุไว้บนหน้านี้ กรุณาอย่าใช้งานเว็บไซต์ [ชื่อเว็บไซต์ของคุณ
      </Typography>

      <Typography variant='h5' gutterBottom>
        1. การใช้ข้อมูลส่วนบุคคล
      </Typography>
      <Typography paragraph>
        เว็บไซต์นี้เก็บรวบรวมข้อมูลส่วนบุคคล เช่น อีเมล, ชื่อ, เบอร์โทรศัพท์, และ ID Line
        เพื่อการให้บริการที่ดียิ่งขึ้นและเพื่อวัตถุประสงค์ในการติดต่อสื่อสาร
        ข้อมูลเหล่านี้จะไม่ถูกเปิดเผยต่อสาธารณะหรือนำไปใช้เพื่อวัตถุประสงค์อื่นๆ นอกเหนือจากการให้บริการบนแพลตฟอร์มนี้
      </Typography>

      <Typography variant='h5' gutterBottom>
        2. คุกกี้
      </Typography>
      <Typography paragraph>
        เราใช้คุกกี้ในการเสริมสร้างประสบการณ์ของผู้ใช้งานบนเว็บไซต์ของเรา การใช้งานเว็บไซต์ https://paiduay.com
        ถือว่าคุณยินยอมให้มีการใช้คุกกี้ตามนโยบายความเป็นส่วนตัวของเรา
      </Typography>

      <Typography variant='h5' gutterBottom>
        3. สิทธิ์ในเนื้อหา
      </Typography>
      <Typography paragraph>
        เว้นแต่จะระบุไว้เป็นอย่างอื่น, LOG21RUBY CO., LTD.
        และ/หรือผู้ให้ใบอนุญาตของเราเป็นเจ้าของสิทธิ์ในทรัพย์สินทางปัญญาสำหรับเนื้อหาทั้งหมดบน https://paiduay.com
        สิทธิ์ในทรัพย์สินทางปัญญาทั้งหมดได้รับการสงวนไว้ คุณสามารถดูและ/หรือพิมพ์หน้าจาก https://paiduay.com
        เพื่อการใช้งานส่วนตัวของคุณเองภายใต้ข้อจำกัดที่กำหนดไว้ในเงื่อนไขและข้อตกลงเหล่านี้
      </Typography>

      <Typography variant='h5' gutterBottom>
        4. การจองและการสร้างทริป
      </Typography>
      <Typography paragraph>
        - การจองทริป: ผู้ใช้สามารถจองทริปที่มีอยู่บนแพลตฟอร์ม ข้อมูลที่จำเป็นในการจอง ได้แก่ ชื่อ, อีเมล,
        เบอร์โทรศัพท์, และ ID Line
      </Typography>
      <Typography paragraph>
        - การสร้างทริป: ผู้ใช้สามารถสร้างทริปและแชร์กับชุมชนผ่านแพลตฟอร์มนี้
        การสร้างทริปจำเป็นต้องมีการให้ข้อมูลเกี่ยวกับรายละเอียดของทริป, รูปภาพ, และข้อมูลอื่นๆ ที่เกี่ยวข้อง
      </Typography>

      <Typography variant='h5' gutterBottom>
        5. การยกเลิกและการคืนเงิน
      </Typography>
      <Typography paragraph>
        โปรดอ่านนโยบายการยกเลิกและการคืนเงินของทริปลีดเดอร์แต่ละคนอย่างละเอียด เพราะแต่ละท่านจะมีนโยบายแตกต่างกัน
      </Typography>

      <Typography variant='h5' gutterBottom>
        6. การเปลี่ยนแปลงเงื่อนไขและข้อตกลง
      </Typography>
      <Typography paragraph>
        LOG21RUBY CO., LTD. ขอสงวนสิทธิ์ในการแก้ไขเงื่อนไขและข้อตกลงเหล่านี้ได้ตลอดเวลา
        การใช้งานเว็บไซต์ของคุณต่อไปหลังจากการเปลี่ยนแปลงถือว่าคุณยอมรับเงื่อนไขและข้อตกลงที่ได้รับการแก้ไข
      </Typography>

      <Typography variant='h5' gutterBottom>
        7. ข้อจำกัดความรับผิด
      </Typography>
      <Typography paragraph>
        เราจะไม่รับผิดชอบต่อความเสียหายหรือความสูญเสียใดๆ ที่เกิดจากการใช้งานเว็บไซต์หรือบริการของเรา
      </Typography>
    </Box>
  )
}

export default TermsAndConditions
