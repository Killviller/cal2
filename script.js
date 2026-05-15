document.addEventListener('DOMContentLoaded', () => {
            
            lucide.createIcons();

            // Datas atualizadas conforme o PDF V5 (Início 22/Ago, Fim 09/Jan/2027)
            const EVENTS = {
                ranges: [
                    { start: '2026-05-12', end: '2026-05-22', type: 'atividade', title: 'Criação das ofertas', desc: 'Pela coordenação do curso' },
                    { start: '2026-05-25', end: '2026-05-29', type: 'atividade', title: 'Validação das ofertas', desc: 'Realizado pelo DEG' },
                    { start: '2026-06-18', end: '2026-06-22', type: 'matricula', title: 'Matrículas 1ª Fase', desc: 'Aluno on-line' },
                    { start: '2026-06-26', end: '2026-06-29', type: 'matricula', title: 'Matrículas 2ª Fase', desc: 'Apenas retardatários' },
                    { start: '2026-07-13', end: '2026-07-15', type: 'atividade', title: 'Reofertas', desc: 'Solicitação via ofício DEG' },
                    { start: '2026-07-16', end: '2026-07-24', type: 'atividade', title: 'Criação das reofertas', desc: 'Realizado pelo DEG' },
                    { start: '2026-07-28', end: '2026-07-31', type: 'excepcional', title: 'Matrícula 3ª Fase', desc: 'Excepcional / Secretários' }
                ],
                single: {
                    '2026-06-24': { type: 'resultado', title: 'Resultado da Matrícula', desc: '1ª Fase' },
                    '2026-07-01': { type: 'resultado', title: 'Resultado da Matrícula', desc: '2ª Fase' },
                    '2026-07-02': { type: 'atividade', title: 'Sincronização Moodle', desc: 'Sincronização das disciplinas' },
                    '2026-08-04': { type: 'resultado', title: 'Resultado Final', desc: 'Todas as matrículas' },
                    '2026-08-05': { type: 'atividade', title: 'Sincronização Moodle', desc: 'Sincronização dos alunos' },
                    '2026-08-22': { type: 'inicio', title: 'Início do Semestre', desc: 'Semestre 2026.2' },
                    '2027-01-09': { type: 'fim', title: 'Fim do Semestre', desc: 'Semestre 2026.2' }
                },
                aulas: [
                    '2026-08-22', '2026-08-28', '2026-08-29',
                    '2026-09-04', '2026-09-05', '2026-09-11', '2026-09-12', '2026-09-18', '2026-09-19', '2026-09-25', '2026-09-26',
                    '2026-10-02', '2026-10-03', '2026-10-09', '2026-10-10', '2026-10-16', '2026-10-17', '2026-10-23', '2026-10-24',
                    '2026-11-06', '2026-11-07', '2026-11-13', '2026-11-14', '2026-11-27', '2026-11-28',
                    '2026-12-04', '2026-12-05', '2026-12-11', '2026-12-12', '2026-12-18'
                ]
            };

            // Adicionado Janeiro de 2027 na Array
            const MONTHS = [
                { name: 'maio', index: 4, year: 2026 }, 
                { name: 'junho', index: 5, year: 2026 },
                { name: 'julho', index: 6, year: 2026 }, 
                { name: 'agosto', index: 7, year: 2026 },
                { name: 'setembro', index: 8, year: 2026 }, 
                { name: 'outubro', index: 9, year: 2026 },
                { name: 'novembro', index: 10, year: 2026 }, 
                { name: 'dezembro', index: 11, year: 2026 },
                { name: 'janeiro', index: 0, year: 2027 }
            ];

            function getFormattedDate(y, m, d) {
                let date = new Date(y, m, d);
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            }

            function getDayEvent(dateStr) {
                if (EVENTS.single[dateStr]) {
                    let ev = EVENTS.single[dateStr];
                    return { type: ev.type, pos: 'single', title: ev.title, desc: ev.desc };
                }
                
                for (let r of EVENTS.ranges) {
                    if (dateStr >= r.start && dateStr <= r.end) {
                        let pos = 'middle';
                        if (dateStr === r.start && dateStr === r.end) pos = 'single';
                        else if (dateStr === r.start) pos = 'start';
                        else if (dateStr === r.end) pos = 'end';
                        return { type: r.type, pos: pos, title: r.title, desc: r.desc };
                    }
                }
                return null;
            }

            const container = document.getElementById('calendar-container');

            MONTHS.forEach((month, idx) => {
                const year = month.year;
                const firstDay = new Date(year, month.index, 1).getDay();
                const daysInMonth = new Date(year, month.index + 1, 0).getDate();
                const daysInPrevMonth = new Date(year, month.index, 0).getDate();

                let days = [];

                for (let i = firstDay - 1; i >= 0; i--) {
                    days.push({ val: daysInPrevMonth - i, isCurrent: false, dateStr: getFormattedDate(year, month.index - 1, daysInPrevMonth - i) });
                }

                for (let i = 1; i <= daysInMonth; i++) {
                    days.push({ val: i, isCurrent: true, dateStr: getFormattedDate(year, month.index, i) });
                }

                const remaining = days.length % 7 === 0 ? 0 : 7 - (days.length % 7);
                for (let i = 1; i <= remaining; i++) {
                     days.push({ val: i, isCurrent: false, dateStr: getFormattedDate(year, month.index + 1, i) });
                }

                const animDelay = 0.2 + (idx * 0.05);

                let html = `
                    <div class="month-card bg-white rounded-xl border border-slate-100 p-4 w-[260px] animate-fade-in-up" style="animation-delay: ${animDelay}s; opacity: 0;">
                        <div class="flex justify-between items-center mb-3">
                            <button class="w-6 h-6 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-md transition-colors html2pdf__hide"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>
                            <h2 class="text-sm font-bold text-slate-900 capitalize mx-auto">${month.name} ${year !== 2026 ? year : ''}</h2>
                            <button class="w-6 h-6 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-md transition-colors html2pdf__hide"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
                        </div>
                        <div class="grid grid-cols-7 text-center mb-1">
                            <span class="text-[0.7rem] font-bold text-slate-400">D</span>
                            <span class="text-[0.7rem] font-bold text-slate-400">S</span>
                            <span class="text-[0.7rem] font-bold text-slate-400">T</span>
                            <span class="text-[0.7rem] font-bold text-slate-400">Q</span>
                            <span class="text-[0.7rem] font-bold text-slate-400">Q</span>
                            <span class="text-[0.7rem] font-bold text-slate-400">S</span>
                            <span class="text-[0.7rem] font-bold text-slate-400">S</span>
                        </div>
                        <div class="calendar-grid-cells">
                `;

                days.forEach((day, index) => {
                    const dayOfWeek = index % 7;
                    const isRowStart = dayOfWeek === 0;
                    const isRowEnd = dayOfWeek === 6;
                    
                    let event = getDayEvent(day.dateStr);
                    
                    let cellClass = "w-8 h-8 flex items-center justify-center text-[13px] font-normal relative mx-auto group/cell ";
                    let isAula = EVENTS.aulas.includes(day.dateStr);
                    let tooltipHtml = '';

                    if (!day.isCurrent) {
                        cellClass += "text-slate-300 pointer-events-none";
                    } else if (event) {
                        let bgDark = event.type === 'matricula' ? 'bg-slate-900' :
                                     event.type === 'atividade' ? 'bg-slate-400' :
                                     event.type === 'resultado' ? 'bg-slate-400' :
                                     event.type === 'inicio' ? 'bg-brand-600' :
                                     event.type === 'fim' ? 'bg-brand-600' :
                                     event.type === 'excepcional' ? 'bg-amber-500' : 'bg-slate-900';
                        
                        let bgLight = event.type === 'matricula' ? 'bg-slate-100' :
                                      event.type === 'atividade' ? 'bg-slate-100' :
                                      event.type === 'excepcional' ? 'bg-amber-50' : 'bg-slate-100';

                        let textDark = 'text-white';
                        let textLight = 'text-slate-900';

                        if (event.pos === 'single') {
                            cellClass += `${bgDark} ${textDark} rounded-md font-medium cursor-pointer`;
                        } else if (event.pos === 'start') {
                            cellClass += `${bgDark} ${textDark} rounded-l-md font-medium cursor-pointer`;
                            if (isRowEnd) cellClass += "rounded-r-md ";
                        } else if (event.pos === 'end') {
                            cellClass += `${bgDark} ${textDark} rounded-r-md font-medium cursor-pointer`;
                            if (isRowStart) cellClass += "rounded-l-md ";
                        } else if (event.pos === 'middle') {
                            cellClass += `${bgLight} ${textLight} cursor-pointer`;
                            if (isRowStart) cellClass += "rounded-l-md ";
                            if (isRowEnd) cellClass += "rounded-r-md ";
                        }

                        let badgeColor = event.type === 'excepcional' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700';
                        if (event.type === 'matricula') badgeColor = 'bg-slate-800 text-slate-100';
                        
                        tooltipHtml = `
                            <div class="tooltip-content absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white border border-slate-200 rounded-lg p-3 z-50 html2pdf__hide flex flex-col items-center text-center">
                                <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${badgeColor} mb-1">${event.type}</span>
                                <span class="text-xs font-bold text-slate-900">${event.title}</span>
                                <span class="text-[10px] text-slate-500 mt-0.5 leading-tight">${event.desc}</span>
                                <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45"></div>
                            </div>
                        `;

                    } else if (isAula) {
                        cellClass += "text-slate-700 bg-white border border-slate-200 rounded-md font-medium cursor-default hover:bg-slate-50";
                        tooltipHtml = `
                            <div class="tooltip-content absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-slate-800 text-white rounded p-2 z-50 html2pdf__hide text-xs font-medium">
                                Dia de Aula
                                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                            </div>
                        `;
                    } else {
                        cellClass += "text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors cursor-default";
                    }

                    html += `<div class="${cellClass}">${day.val} ${tooltipHtml}</div>`;
                });

                html += `</div></div>`;
                container.innerHTML += html;
            });
            
        }); 

        // ==========================================
        // FUNÇÃO GLOBAL DE GERAÇÃO DE PDF (html2pdf)
        // ==========================================
        
        window.generatePDF = async function() {
            const btn = document.getElementById('btn-pdf');
            const originalContent = btn.innerHTML;
            const element = document.getElementById('pdf-content');

            // Feedback visual e desativa botão
            btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>Gerando PDF (Paisagem)...</span>';
            btn.classList.add('opacity-80', 'pointer-events-none');
            lucide.createIcons();

            // Adiciona a classe que força e compacta a largura e margens pro layout de PDF em Paisagem
            element.classList.remove('shadow-sm');
            element.classList.add('pdf-mode');

            // Configurações estritas para garantir PDF Perfeito e que não "corte" na vertical
            const opt = {
                margin:       [10, 10, 10, 10], // Margem A4 [top, left, bottom, right]
                filename:     'Calendario_Academico_EAD_2026_2.pdf',
                image:        { type: 'jpeg', quality: 1 }, 
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true,
                    letterRendering: true,
                    windowWidth: 1250, // Trava a largura virtual da página para capturar a grade corretamente
                    scrollY: 0         // Força captura a partir do topo do documento
                },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }, // Formato Paisagem
                pagebreak:    { mode: ['css', 'legacy'] } // Avisa a biblioteca para respeitar o page-break-before do CSS!
            };

            try {
                // Pequeno delay obrigatório para a tela repintar as classes 'pdf-mode'
                await new Promise(resolve => setTimeout(resolve, 250));
                
                await html2pdf().set(opt).from(element).save();
                
            } catch (error) {
                console.error("Erro ao gerar PDF: ", error);
                alert("Houve um problema ao exportar o arquivo. Tente novamente.");
            } finally {
                // Remove a classe do modo PDF e restaura o botão original
                element.classList.remove('pdf-mode');
                element.classList.add('shadow-sm');
                btn.innerHTML = originalContent;
                btn.classList.remove('opacity-80', 'pointer-events-none');
                lucide.createIcons();
            }
        };
