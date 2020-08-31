module.exports = function condition1func(myHistory, myGraduateInfo) {
  const state = {
    이수요건: {
      전문교양: {
        qualify: 0,
      },
      MSC: {
        qualify: 0,
      },
      전공기초영어: {
        qualify: 0,
      },
      전공: {
        qualify: 0,
      },
      이수학점: {
        qualify: 0,
      },
    },
    전공기초영어: {
      qualify: 0,
    },
    전문교양: {
      기초교양: {
        글쓰기: false,
        영어: false,
      },
      핵심교양필수영역: {
        //핵심교양 영역 6~8 에서 영역별 각 1과목 이상 이수하여야 함.
        qualify: false,
      },
      일반교양필수영역: {
        //일반교양 영역 1~ 5 중 4개의 영역을 선택하여 강 영역별 1과목 이상 수행.
        qualify: false,
      },
    },
    MSC: {
      과학: {
        qualify: 0,
      },
      수학: {
        qualify: 0,
      },
      과학조건: {
        qualify: 0,
      },
    },
  };

  const mySubjects = myHistory.map((x) => x.subject);

  const 전문교양 = parseInt(
    myGraduateInfo.find((x) => x.subject === '기본/소양/교양 계').degree,
    10
  );
  if (전문교양 >= 20) {
    state['이수요건']['전문교양']['qualify'] = 0;
  } else {
    state['이수요건']['전문교양']['qualify'] = 20 - 전문교양;
  }

  const MSC = parseInt(
    myGraduateInfo.find((x) => x.subject === '심화과정 MSC인정학점').degree,
    10
  );

  if (MSC >= 18) {
    state['이수요건']['전문교양']['qualify'] = 0;
  } else {
    state['이수요건']['전문교양']['qualify'] = 18 - MSC;
  }

  if (
    mySubjects.includes('전공기초영어(Ⅰ)') ||
    mySubjects.includes('전공기초영어(Ⅱ)')
  ) {
    state['이수요건']['전공기초영어']['qualify'] = 0;
    state['전공기초영어']['qualify'] = 0;
  } else {
    state['이수요건']['전공기초영어']['qualify'] = 3;
    state['전공기초영어']['qualify'] = 3;
  }

  const 전공학점 = parseInt(
    myGraduateInfo.find((x) => x.subject === '전공').degree,
    10
  );

  if (전공학점 >= 50) {
    state['이수요건']['전공']['qualify'] = 0;
  } else {
    state['이수요건']['전공']['qualify'] = 50 - 전공학점;
  }

  // const 졸업인정학점 = parseInt(
  //   myGraduateInfo.find((x) => x.subject === '졸업인정학점').degree,
  //   10
  // );

  let 졸업인정학점;
  myGraduateInfo.map((x) => {
    if (x.subject === '졸업인정학점') {
      졸업인정학점 = x.degree;
    }
  });

  if (졸업인정학점 >= 140) {
    state['이수요건']['이수학점']['qualify'] = 0;
  } else {
    state['이수요건']['이수학점']['qualify'] = 140 - 졸업인정학점;
  }

  const dragonBall = {
    일교1: false, //언어와 논리
    일교2: false, // 사회와 경제
    일교3: false, // 역사와 문화
    일교4: false, //예술과 철학
    일교5: false, //제2 외국어
    핵교6: false, //경영과 법률
    핵교7: false, //공학의 이해
    핵교8: false, //의사소통
  };

  myGraduateInfo.map((x) => {
    switch (x.subject) {
      case '일교1':
        dragonBall['일교1'] = x.degree > 0 ? true : false;
        break;
      case '일교2':
        dragonBall['일교2'] = x.degree > 0 ? true : false;
        break;
      case '일교3':
        dragonBall['일교3'] = x.degree > 0 ? true : false;
        break;
      case '일교4':
        dragonBall['일교4'] = x.degree > 0 ? true : false;
        break;
      case '일교5':
        dragonBall['일교5'] = x.degree > 0 ? true : false;
        break;
      case '핵교6':
        dragonBall['핵교6'] = x.degree > 0 ? true : false;
        break;
      case '핵교7':
        dragonBall['핵교7'] = x.degree > 0 ? true : false;
        break;
      case '핵교8':
        dragonBall['핵교8'] = x.degree > 0 ? true : false;
        break;
      default:
        break;
    }
  });

  myHistory.map((x) => {
    if (
      x.subject.indexOf('논리적사고와글쓰기') != -1 ||
      x.subject.indexOf('공학글쓰기') != -1
    ) {
      state['전문교양']['기초교양']['글쓰기'] = true;
    }
    if (x.subject === '영어') {
      state['전문교양']['기초교양']['영어'] = true;
    }
  });

  if (dragonBall['핵교6'] && dragonBall['핵교7'] && dragonBall['핵교8']) {
    state['전문교양']['핵심교양필수영역']['qualify'] = true;
  } else {
    state['전문교양']['핵심교양필수영역']['qualify'] = false;
  }

  if (
    Object.keys(dragonBall).filter(
      (x) => dragonBall[x] && x.indexOf('일교') !== -1
    ).length >= 4
  ) {
    state['전문교양']['일반교양필수영역']['qualify'] = true;
  } else {
    state['전문교양']['일반교양필수영역']['qualify'] = false;
  }

  const scienceScore = parseInt(
    myGraduateInfo.find((x) => x.subject === '과학').degree,
    10
  );
  if (scienceScore >= 9) {
    state['MSC']['과학'] = 0;
  } else {
    state['MSC']['과학'] = 9 - scienceScore;
  }

  const mathScore = parseInt(
    myGraduateInfo.find((x) => x.subject === '수학').degree,
    10
  );

  if (mathScore >= 9) {
    state['MSC']['수학'] = 0;
  } else {
    state['MSC']['수학'] = 9 - mathScore;
  }

  const science = {
    '대학물리(1)': false,
    '대학물리실험(1)': false,
    '대학화학(1)': false,
    '대학화학실험(1)': false,
    '대학물리(2)': false,
    '대학물리실험(2)': false,
    '대학화학(2)': false,
    '대학화학실험(2)': false,
  };

  myHistory.map((x) => {
    if (Object.prototype.hasOwnProperty.call(science, x.subject)) {
      science[x.subject] = true;
    }
    // if (science.hasOwnProperty(x.subject)) {
    //   science[x.subject] = true;
    // }
  });

  if (
    science['대학물리(1)'] &&
    science['대학물리실험(1)'] &&
    science['대학화학(1)'] &&
    science['대학화학실험(1)'] &&
    ((science['대학물리(2)'] && science['대학물리실험(2)']) ||
      (science['대학화학(2)'] && science['대학화학실험(2)']))
  ) {
    state['MSC']['과학조건'] = true;
  } else {
    state['MSC']['과학조건'] = false;
  }
  return state;
};

// ※ 컴퓨터공학전공 학생은 다음의 MSC 전산 3과목<정보시스템개론,객체지향프로그래밍,C-프로그래밍) 중 6학점을 이수해야 함.
// ※ 산업공학전공 학생은 다음의 MSC 전산 3과목<정보시스템개론,웹프로그래밍,C-프로그래밍) 중 6학점을 이수해야 함.